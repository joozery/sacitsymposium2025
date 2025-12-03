const db = require('../db/db');
const { s3Client } = require('../aws-config-v3');
const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

class ExhibitionController {
  // ดึงรายการนิทรรศการทั้งหมด
  static async getAllExhibitions(req, res) {
    try {
      const { status = 'active', search } = req.query;
      
      let query = `
        SELECT 
          id, name, position, image_url, pdf_url, pdf_filename, status, 
          created_at, updated_at
        FROM exhibitions 
        WHERE status = ?
      `;
      let params = [status];

      if (search) {
        query += ` AND (name LIKE ? OR position LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY created_at DESC`;

      const [exhibitions] = await db.execute(query, params);

      res.json({
        success: true,
        data: exhibitions,
        count: exhibitions.length
      });
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถดึงข้อมูลนิทรรศการได้',
        error: error.message
      });
    }
  }

  // ดึงข้อมูลนิทรรศการตาม ID
  static async getExhibitionById(req, res) {
    try {
      const { id } = req.params;

      const [rows] = await db.execute(
        `SELECT 
          id, name, position, image_url, pdf_url, pdf_filename, status, 
          created_at, updated_at
        FROM exhibitions 
        WHERE id = ? AND status = 'active'`,
        [id]
      );

      const exhibition = rows && rows.length ? rows[0] : null;
      if (!exhibition) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลนิทรรศการ'
        });
      }

      res.json({
        success: true,
        data: exhibition
      });
    } catch (error) {
      console.error('Error fetching exhibition:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถดึงข้อมูลนิทรรศการได้',
        error: error.message
      });
    }
  }

  // สร้างนิทรรศการใหม่ (พร้อมอัปโหลดไฟล์)
  static async createExhibition(req, res) {
    try {
      const { name, position } = req.body;
      const files = req.files;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'กรุณาระบุชื่อนิทรรศการ'
        });
      }

      let imageUrl = null, imageKey = null;
      let pdfUrl = null, pdfKey = null, pdfFilename = null;

      // Skip file upload temporarily if AWS is not configured
      const hasValidAWS = process.env.AWS_ACCESS_KEY_ID && 
                         process.env.AWS_SECRET_ACCESS_KEY && 
                         !process.env.AWS_ACCESS_KEY_ID.includes('EXAMPLE');

      // อัปโหลดรูปภาพ (ถ้ามี และ AWS configured)
      if (files?.image && hasValidAWS) {
        const imageFile = files.image[0];
        const imageKeyPath = `exhibitions/images/${uuidv4()}_${imageFile.originalname}`;
        
        const imageUpload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageKeyPath,
            Body: imageFile.buffer,
            ContentType: imageFile.mimetype,
            ACL: 'public-read',
          },
        });

        const imageResult = await imageUpload.done();
        imageUrl = imageResult.Location;
        imageKey = imageKeyPath;
        
        console.log('📸 Exhibition image uploaded:', imageKeyPath);
      }

      // อัปโหลดไฟล์ PDF (ถ้ามี และ AWS configured)
      if (files?.pdf && hasValidAWS) {
        const pdfFile = files.pdf[0];
        const pdfKeyPath = `exhibitions/documents/${uuidv4()}_${pdfFile.originalname}`;
        
        const pdfUpload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: pdfKeyPath,
            Body: pdfFile.buffer,
            ContentType: pdfFile.mimetype,
            ACL: 'public-read',
          },
        });

        const pdfResult = await pdfUpload.done();
        pdfUrl = pdfResult.Location;
        pdfKey = pdfKeyPath;
        pdfFilename = pdfFile.originalname;
        
        console.log('📄 Exhibition PDF uploaded:', pdfKeyPath);
      }

      // Log file upload status
      if (!hasValidAWS && (files?.image || files?.pdf)) {
        console.log('⚠️ AWS not configured - skipping file uploads');
      }

      // บันทึกข้อมูลลงฐานข้อมูล
      const [result] = await db.execute(
        `INSERT INTO exhibitions (name, position, image_url, image_key, pdf_url, pdf_key, pdf_filename) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, position, imageUrl, imageKey, pdfUrl, pdfKey, pdfFilename]
      );

      // ดึงข้อมูลที่เพิ่งสร้าง
      const [createdRows] = await db.execute(
        `SELECT 
          id, name, position, image_url, pdf_url, pdf_filename, status, 
          created_at, updated_at
        FROM exhibitions 
        WHERE id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'เพิ่มนิทรรศการเรียบร้อยแล้ว',
        data: createdRows && createdRows.length ? createdRows[0] : null
      });
    } catch (error) {
      console.error('Error creating exhibition:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถเพิ่มนิทรรศการได้',
        error: error.message
      });
    }
  }

  // อัปเดตข้อมูลนิทรรศการ
  static async updateExhibition(req, res) {
    try {
      const { id } = req.params;
      const { name, position } = req.body;
      const files = req.files;

      // ตรวจสอบว่านิทรรศการมีอยู่หรือไม่
      const [existingRows] = await db.execute(
        'SELECT * FROM exhibitions WHERE id = ? AND status = "active"',
        [id]
      );

      const existingExhibition = existingRows && existingRows.length ? existingRows[0] : null;
      if (!existingExhibition) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลนิทรรศการ'
        });
      }

      let updateData = {};
      let updateFields = [];
      let updateValues = [];

      // อัปเดตชื่อ (ถ้ามี)
      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }

      // อัปเดตตำแหน่ง (ถ้ามี)
      if (position !== undefined) {
        updateFields.push('position = ?');
        updateValues.push(position);
      }

      // อัปโหลดรูปภาพใหม่ (ถ้ามี)
      if (files?.image) {
        // ลบรูปเก่า (ถ้ามี)
        if (existingExhibition.image_key) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: existingExhibition.image_key,
            });
            await s3Client.send(deleteCommand);
            console.log('🗑️ Old exhibition image deleted:', existingExhibition.image_key);
          } catch (deleteError) {
            console.warn('Warning: Could not delete old image:', deleteError.message);
          }
        }

        // อัปโหลดรูปใหม่
        const imageFile = files.image[0];
        const imageKeyPath = `exhibitions/images/${uuidv4()}_${imageFile.originalname}`;
        
        const imageUpload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageKeyPath,
            Body: imageFile.buffer,
            ContentType: imageFile.mimetype,
            ACL: 'public-read',
          },
        });

        const imageResult = await imageUpload.done();
        
        updateFields.push('image_url = ?', 'image_key = ?');
        updateValues.push(imageResult.Location, imageKeyPath);
        
        console.log('📸 Exhibition image updated:', imageKeyPath);
      }

      // อัปโหลดไฟล์ PDF ใหม่ (ถ้ามี)
      if (files?.pdf) {
        // ลบไฟล์ PDF เก่า (ถ้ามี)
        if (existingExhibition.pdf_key) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: existingExhibition.pdf_key,
            });
            await s3Client.send(deleteCommand);
            console.log('🗑️ Old exhibition PDF deleted:', existingExhibition.pdf_key);
          } catch (deleteError) {
            console.warn('Warning: Could not delete old PDF:', deleteError.message);
          }
        }

        // อัปโหลดไฟล์ PDF ใหม่
        const pdfFile = files.pdf[0];
        const pdfKeyPath = `exhibitions/documents/${uuidv4()}_${pdfFile.originalname}`;
        
        const pdfUpload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: pdfKeyPath,
            Body: pdfFile.buffer,
            ContentType: pdfFile.mimetype,
            ACL: 'public-read',
          },
        });

        const pdfResult = await pdfUpload.done();
        
        updateFields.push('pdf_url = ?', 'pdf_key = ?', 'pdf_filename = ?');
        updateValues.push(pdfResult.Location, pdfKeyPath, pdfFile.originalname);
        
        console.log('📄 Exhibition PDF updated:', pdfKeyPath);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'ไม่มีข้อมูลที่ต้องอัปเดต'
        });
      }

      // อัปเดตฐานข้อมูล
      updateValues.push(id);
      await db.execute(
        `UPDATE exhibitions SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );

      // ดึงข้อมูลที่อัปเดตแล้ว
      const [updatedRows] = await db.execute(
        `SELECT 
          id, name, position, image_url, pdf_url, pdf_filename, status, 
          created_at, updated_at
        FROM exhibitions 
        WHERE id = ?`,
        [id]
      );

      res.json({
        success: true,
        message: 'อัปเดตข้อมูลนิทรรศการเรียบร้อยแล้ว',
        data: updatedRows && updatedRows.length ? updatedRows[0] : null
      });
    } catch (error) {
      console.error('Error updating exhibition:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถอัปเดตข้อมูลนิทรรศการได้',
        error: error.message
      });
    }
  }

  // ลบนิทรรศการ (soft delete)
  static async deleteExhibition(req, res) {
    try {
      const { id } = req.params;

      // ตรวจสอบว่านิทรรศการมีอยู่หรือไม่
      const [existingRows2] = await db.execute(
        'SELECT * FROM exhibitions WHERE id = ? AND status = "active"',
        [id]
      );

      const existingExhibition = existingRows2 && existingRows2.length ? existingRows2[0] : null;
      if (!existingExhibition) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลนิทรรศการ'
        });
      }

      // Soft delete - เปลี่ยนสถานะเป็น inactive
      await db.execute(
        'UPDATE exhibitions SET status = "inactive", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'ลบนิทรรศการเรียบร้อยแล้ว'
      });
    } catch (error) {
      console.error('Error deleting exhibition:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถลบนิทรรศการได้',
        error: error.message
      });
    }
  }

  // ลบนิทรรศการถาวร
  static async permanentDeleteExhibition(req, res) {
    try {
      const { id } = req.params;

      // ตรวจสอบว่านิทรรศการมีอยู่หรือไม่
      const [existingRows3] = await db.execute(
        'SELECT * FROM exhibitions WHERE id = ?',
        [id]
      );

      const existingExhibition = existingRows3 && existingRows3.length ? existingRows3[0] : null;
      if (!existingExhibition) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลนิทรรศการ'
        });
      }

      // ลบไฟล์จาก S3 (ถ้ามี)
      if (existingExhibition.image_key) {
        try {
          const deleteImageCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: existingExhibition.image_key,
          });
          await s3Client.send(deleteImageCommand);
          console.log('🗑️ Exhibition image deleted from S3:', existingExhibition.image_key);
        } catch (deleteError) {
          console.warn('Warning: Could not delete image from S3:', deleteError.message);
        }
      }

      if (existingExhibition.pdf_key) {
        try {
          const deletePdfCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: existingExhibition.pdf_key,
          });
          await s3Client.send(deletePdfCommand);
          console.log('🗑️ Exhibition PDF deleted from S3:', existingExhibition.pdf_key);
        } catch (deleteError) {
          console.warn('Warning: Could not delete PDF from S3:', deleteError.message);
        }
      }

      // ลบข้อมูลจากฐานข้อมูล
      await db.execute('DELETE FROM exhibitions WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'ลบนิทรรศการถาวรเรียบร้อยแล้ว'
      });
    } catch (error) {
      console.error('Error permanently deleting exhibition:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถลบนิทรรศการถาวรได้',
        error: error.message
      });
    }
  }
}

module.exports = ExhibitionController; 