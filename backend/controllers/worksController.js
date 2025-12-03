const db = require('../db/db');
const { s3Client } = require('../aws-config-v3');
const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

class WorksController {
  // ดึงรายการผลงานสร้างสรรค์ทั้งหมด
  static async getAllWorks(req, res) {
    try {
      const { status = 'active', search, category } = req.query;
      
      let query = `
        SELECT 
          id, name, owner_name, description, category, technique, 
          photo_url, pdf_url, pdf_filename, status, display_order,
          created_at, updated_at
        FROM works 
        WHERE status = ?
      `;
      let params = [status];

      if (search) {
        query += ` AND (name LIKE ? OR owner_name LIKE ? OR description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (category) {
        query += ` AND category = ?`;
        params.push(category);
      }

      query += ` ORDER BY display_order ASC, created_at DESC`;

      const [works] = await db.execute(query, params);

      res.json({
        success: true,
        data: works,
        count: works.length
      });
    } catch (error) {
      console.error('Error fetching works:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถดึงข้อมูลผลงานสร้างสรรค์ได้',
        error: error.message
      });
    }
  }

  // ดึงข้อมูลผลงานสร้างสรรค์ตาม ID
  static async getWorkById(req, res) {
    try {
      const { id } = req.params;

      const [rows] = await db.execute(
        `SELECT 
          id, name, owner_name, description, category, technique,
          photo_url, pdf_url, pdf_filename, status, display_order,
          created_at, updated_at
        FROM works 
        WHERE id = ? AND status = 'active'`,
        [id]
      );

      const work = rows && rows.length ? rows[0] : null;
      if (!work) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผลงานสร้างสรรค์'
        });
      }

      res.json({
        success: true,
        data: work
      });
    } catch (error) {
      console.error('Error fetching work:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถดึงข้อมูลผลงานสร้างสรรค์ได้',
        error: error.message
      });
    }
  }

  // สร้างผลงานสร้างสรรค์ใหม่ (พร้อมอัปโหลดไฟล์)
  static async createWork(req, res) {
    try {
      const { name, owner_name, description, category, technique, display_order } = req.body;
      const files = req.files;

      if (!name || !owner_name) {
        return res.status(400).json({
          success: false,
          message: 'กรุณาระบุชื่อผลงานและชื่อเจ้าของผลงาน'
        });
      }

      let photoUrl = null, photoKey = null;
      let pdfUrl = null, pdfKey = null, pdfFilename = null;

      // Skip file upload temporarily if AWS is not configured
      const hasValidAWS = process.env.AWS_ACCESS_KEY_ID && 
                         process.env.AWS_SECRET_ACCESS_KEY && 
                         !process.env.AWS_ACCESS_KEY_ID.includes('EXAMPLE');

      // อัปโหลดรูปภาพ (ถ้ามี และ AWS configured)
      if (files?.photo && hasValidAWS) {
        const photoFile = files.photo[0];
        const photoKeyPath = `works/photos/${uuidv4()}_${photoFile.originalname}`;
        
        const photoUpload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: photoKeyPath,
            Body: photoFile.buffer,
            ContentType: photoFile.mimetype,
            ACL: 'public-read',
          },
        });

        const photoResult = await photoUpload.done();
        photoUrl = photoResult.Location;
        photoKey = photoKeyPath;
        
        console.log('📸 Work photo uploaded:', photoKeyPath);
      }

      // อัปโหลดไฟล์ PDF (ถ้ามี และ AWS configured)
      if (files?.pdf && hasValidAWS) {
        const pdfFile = files.pdf[0];
        const pdfKeyPath = `works/documents/${uuidv4()}_${pdfFile.originalname}`;
        
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
        
        console.log('📄 Work PDF uploaded:', pdfKeyPath);
      }

      // Log file upload status
      if (!hasValidAWS && (files?.photo || files?.pdf)) {
        console.log('⚠️ AWS not configured - skipping file uploads');
      }

      // บันทึกข้อมูลลงฐานข้อมูล
      const [result] = await db.execute(
        `INSERT INTO works (name, owner_name, description, category, technique, photo_url, photo_key, pdf_url, pdf_key, pdf_filename, display_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, owner_name, description, category, technique, photoUrl, photoKey, pdfUrl, pdfKey, pdfFilename, display_order || 0]
      );

      // ดึงข้อมูลที่เพิ่งสร้าง
      const [createdRows] = await db.execute(
        `SELECT 
          id, name, owner_name, description, category, technique,
          photo_url, pdf_url, pdf_filename, status, display_order,
          created_at, updated_at
        FROM works 
        WHERE id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'เพิ่มผลงานสร้างสรรค์เรียบร้อยแล้ว',
        data: createdRows && createdRows.length ? createdRows[0] : null
      });
    } catch (error) {
      console.error('Error creating work:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถเพิ่มผลงานสร้างสรรค์ได้',
        error: error.message
      });
    }
  }

  // อัปเดตข้อมูลผลงานสร้างสรรค์
  static async updateWork(req, res) {
    try {
      const { id } = req.params;
      const { name, owner_name, description, category, technique, display_order } = req.body;
      const files = req.files;

      // ตรวจสอบว่าผลงานมีอยู่หรือไม่
      const [existingRows] = await db.execute(
        'SELECT * FROM works WHERE id = ? AND status = "active"',
        [id]
      );

      const existingWork = existingRows && existingRows.length ? existingRows[0] : null;
      if (!existingWork) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผลงานสร้างสรรค์'
        });
      }

      let updateData = {};
      let updateFields = [];
      let updateValues = [];

      // อัปเดตข้อมูลพื้นฐาน (ถ้ามี)
      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      if (owner_name) {
        updateFields.push('owner_name = ?');
        updateValues.push(owner_name);
      }
      if (description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (category) {
        updateFields.push('category = ?');
        updateValues.push(category);
      }
      if (technique) {
        updateFields.push('technique = ?');
        updateValues.push(technique);
      }
      if (display_order !== undefined) {
        updateFields.push('display_order = ?');
        updateValues.push(display_order);
      }

      // อัปโหลดรูปภาพใหม่ (ถ้ามี)
      if (files?.photo) {
        // ลบรูปภาพเก่า (ถ้ามี)
        if (existingWork.photo_key) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: existingWork.photo_key,
            });
            await s3Client.send(deleteCommand);
            console.log('🗑️ Old work photo deleted:', existingWork.photo_key);
          } catch (deleteError) {
            console.warn('Warning: Could not delete old photo:', deleteError.message);
          }
        }

        // อัปโหลดรูปภาพใหม่
        const photoFile = files.photo[0];
        const photoKeyPath = `works/photos/${uuidv4()}_${photoFile.originalname}`;
        
        const photoUpload = new Upload({
          client: s3Client,
          params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: photoKeyPath,
            Body: photoFile.buffer,
            ContentType: photoFile.mimetype,
            ACL: 'public-read',
          },
        });

        const photoResult = await photoUpload.done();
        
        updateFields.push('photo_url = ?', 'photo_key = ?');
        updateValues.push(photoResult.Location, photoKeyPath);
        
        console.log('📸 Work photo updated:', photoKeyPath);
      }

      // อัปโหลดไฟล์ PDF ใหม่ (ถ้ามี)
      if (files?.pdf) {
        // ลบไฟล์ PDF เก่า (ถ้ามี)
        if (existingWork.pdf_key) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: existingWork.pdf_key,
            });
            await s3Client.send(deleteCommand);
            console.log('🗑️ Old work PDF deleted:', existingWork.pdf_key);
          } catch (deleteError) {
            console.warn('Warning: Could not delete old PDF:', deleteError.message);
          }
        }

        // อัปโหลดไฟล์ PDF ใหม่
        const pdfFile = files.pdf[0];
        const pdfKeyPath = `works/documents/${uuidv4()}_${pdfFile.originalname}`;
        
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
        
        console.log('📄 Work PDF updated:', pdfKeyPath);
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
        `UPDATE works SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );

      // ดึงข้อมูลที่อัปเดตแล้ว
      const [updatedRows] = await db.execute(
        `SELECT 
          id, name, owner_name, description, category, technique,
          photo_url, pdf_url, pdf_filename, status, display_order,
          created_at, updated_at
        FROM works 
        WHERE id = ?`,
        [id]
      );

      res.json({
        success: true,
        message: 'อัปเดตข้อมูลผลงานสร้างสรรค์เรียบร้อยแล้ว',
        data: updatedRows && updatedRows.length ? updatedRows[0] : null
      });
    } catch (error) {
      console.error('Error updating work:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถอัปเดตข้อมูลผลงานสร้างสรรค์ได้',
        error: error.message
      });
    }
  }

  // ลบผลงานสร้างสรรค์ (soft delete)
  static async deleteWork(req, res) {
    try {
      const { id } = req.params;

      // ตรวจสอบว่าผลงานมีอยู่หรือไม่
      const [existingRows2] = await db.execute(
        'SELECT * FROM works WHERE id = ? AND status = "active"',
        [id]
      );

      const existingWork = existingRows2 && existingRows2.length ? existingRows2[0] : null;
      if (!existingWork) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผลงานสร้างสรรค์'
        });
      }

      // Soft delete โดยเปลี่ยน status เป็น inactive
      await db.execute(
        'UPDATE works SET status = "inactive", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'ลบผลงานสร้างสรรค์เรียบร้อยแล้ว'
      });
    } catch (error) {
      console.error('Error deleting work:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถลบผลงานสร้างสรรค์ได้',
        error: error.message
      });
    }
  }

  // ลบผลงานสร้างสรรค์ถาวร (hard delete)
  static async permanentDeleteWork(req, res) {
    try {
      const { id } = req.params;

      // ตรวจสอบว่าผลงานมีอยู่หรือไม่
      const [existingRows3] = await db.execute(
        'SELECT * FROM works WHERE id = ?',
        [id]
      );

      const existingWork = existingRows3 && existingRows3.length ? existingRows3[0] : null;
      if (!existingWork) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผลงานสร้างสรรค์'
        });
      }

      // ลบไฟล์จาก S3 (ถ้ามี)
      if (existingWork.photo_key) {
        try {
          const deletePhotoCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: existingWork.photo_key,
          });
          await s3Client.send(deletePhotoCommand);
          console.log('🗑️ Work photo deleted from S3:', existingWork.photo_key);
        } catch (deleteError) {
          console.warn('Warning: Could not delete photo from S3:', deleteError.message);
        }
      }

      if (existingWork.pdf_key) {
        try {
          const deletePdfCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: existingWork.pdf_key,
          });
          await s3Client.send(deletePdfCommand);
          console.log('🗑️ Work PDF deleted from S3:', existingWork.pdf_key);
        } catch (deleteError) {
          console.warn('Warning: Could not delete PDF from S3:', deleteError.message);
        }
      }

      // ลบข้อมูลจากฐานข้อมูล
      await db.execute('DELETE FROM works WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'ลบผลงานสร้างสรรค์ถาวรเรียบร้อยแล้ว'
      });
    } catch (error) {
      console.error('Error permanently deleting work:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถลบผลงานสร้างสรรค์ถาวรได้',
        error: error.message
      });
    }
  }
}

module.exports = WorksController; 