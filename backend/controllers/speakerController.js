const db = require('../db/db');
const { s3Client } = require('../aws-config-v3');
const { Upload } = require('@aws-sdk/lib-storage');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

class SpeakerController {
  // ดึงรายการผู้บรรยายทั้งหมด
  static async getAllSpeakers(req, res) {
    try {
      const { status = 'active', search } = req.query;
      
      let query = `
        SELECT 
          id, name, position, photo_url, pdf_url, pdf_filename, status, 
          created_at, updated_at
        FROM speakers 
        WHERE status = ?
      `;
      let params = [status];

      if (search) {
        query += ` AND (name LIKE ? OR position LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      query += ` ORDER BY created_at DESC`;

      const [speakers] = await db.execute(query, params);

      res.json({
        success: true,
        data: speakers,
        count: speakers.length
      });
    } catch (error) {
      console.error('Error fetching speakers:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถดึงข้อมูลผู้บรรยายได้',
        error: error.message
      });
    }
  }

  // ดึงข้อมูลผู้บรรยายตาม ID
  static async getSpeakerById(req, res) {
    try {
      const { id } = req.params;

      const [rows] = await db.execute(
        `SELECT 
          id, name, position, photo_url, pdf_url, pdf_filename, status, 
          created_at, updated_at
        FROM speakers 
        WHERE id = ? AND status = 'active'`,
        [id]
      );

      const speaker = rows && rows.length ? rows[0] : null;
      if (!speaker) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผู้บรรยาย'
        });
      }

      res.json({
        success: true,
        data: speaker
      });
    } catch (error) {
      console.error('Error fetching speaker:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถดึงข้อมูลผู้บรรยายได้',
        error: error.message
      });
    }
  }

  // สร้างผู้บรรยายใหม่ (พร้อมอัปโหลดไฟล์)
  static async createSpeaker(req, res) {
    try {
      const { name, position } = req.body;
      const files = req.files;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'กรุณาระบุชื่อผู้บรรยาย'
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
        const photoKeyPath = `speakers/photos/${uuidv4()}_${photoFile.originalname}`;
        
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
        
        console.log('📸 Speaker photo uploaded:', photoKeyPath);
      }

      // อัปโหลดไฟล์ PDF (ถ้ามี และ AWS configured)
      if (files?.pdf && hasValidAWS) {
        const pdfFile = files.pdf[0];
        const pdfKeyPath = `speakers/documents/${uuidv4()}_${pdfFile.originalname}`;
        
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
        
        console.log('📄 Speaker PDF uploaded:', pdfKeyPath);
      }

      // Log file upload status
      if (!hasValidAWS && (files?.photo || files?.pdf)) {
        console.log('⚠️ AWS not configured - skipping file uploads');
      }

      // บันทึกข้อมูลลงฐานข้อมูล
      const [result] = await db.execute(
        `INSERT INTO speakers (name, position, photo_url, photo_key, pdf_url, pdf_key, pdf_filename) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, position, photoUrl, photoKey, pdfUrl, pdfKey, pdfFilename]
      );

      // ดึงข้อมูลที่เพิ่งสร้าง
      const [createdRows] = await db.execute(
        `SELECT 
          id, name, position, photo_url, pdf_url, pdf_filename, status, 
          created_at, updated_at
        FROM speakers 
        WHERE id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'เพิ่มผู้บรรยายเรียบร้อยแล้ว',
        data: createdRows && createdRows.length ? createdRows[0] : null
      });
    } catch (error) {
      console.error('Error creating speaker:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถเพิ่มผู้บรรยายได้',
        error: error.message
      });
    }
  }

  // อัปเดตข้อมูลผู้บรรยาย
  static async updateSpeaker(req, res) {
    try {
      const { id } = req.params;
      const { name, position } = req.body;
      const files = req.files;

      // ตรวจสอบว่าผู้บรรยายมีอยู่หรือไม่
      const [existingRows] = await db.execute(
        'SELECT * FROM speakers WHERE id = ? AND status = "active"',
        [id]
      );

      const existingSpeaker = existingRows && existingRows.length ? existingRows[0] : null;
      if (!existingSpeaker) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผู้บรรยาย'
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
      if (files?.photo) {
        // ลบรูปเก่า (ถ้ามี)
        if (existingSpeaker.photo_key) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: existingSpeaker.photo_key,
            });
            await s3Client.send(deleteCommand);
            console.log('🗑️ Old speaker photo deleted:', existingSpeaker.photo_key);
          } catch (deleteError) {
            console.warn('Warning: Could not delete old photo:', deleteError.message);
          }
        }

        // อัปโหลดรูปใหม่
        const photoFile = files.photo[0];
        const photoKeyPath = `speakers/photos/${uuidv4()}_${photoFile.originalname}`;
        
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
        
        console.log('📸 Speaker photo updated:', photoKeyPath);
      }

      // อัปโหลดไฟล์ PDF ใหม่ (ถ้ามี)
      if (files?.pdf) {
        // ลบไฟล์ PDF เก่า (ถ้ามี)
        if (existingSpeaker.pdf_key) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: existingSpeaker.pdf_key,
            });
            await s3Client.send(deleteCommand);
            console.log('🗑️ Old speaker PDF deleted:', existingSpeaker.pdf_key);
          } catch (deleteError) {
            console.warn('Warning: Could not delete old PDF:', deleteError.message);
          }
        }

        // อัปโหลดไฟล์ PDF ใหม่
        const pdfFile = files.pdf[0];
        const pdfKeyPath = `speakers/documents/${uuidv4()}_${pdfFile.originalname}`;
        
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
        
        console.log('📄 Speaker PDF updated:', pdfKeyPath);
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
        `UPDATE speakers SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );

      // ดึงข้อมูลที่อัปเดตแล้ว
      const [updatedRows] = await db.execute(
        `SELECT 
          id, name, position, photo_url, pdf_url, pdf_filename, status, 
          created_at, updated_at
        FROM speakers 
        WHERE id = ?`,
        [id]
      );

      res.json({
        success: true,
        message: 'อัปเดตข้อมูลผู้บรรยายเรียบร้อยแล้ว',
        data: updatedRows && updatedRows.length ? updatedRows[0] : null
      });
    } catch (error) {
      console.error('Error updating speaker:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถอัปเดตข้อมูลผู้บรรยายได้',
        error: error.message
      });
    }
  }

  // ลบผู้บรรยาย (soft delete)
  static async deleteSpeaker(req, res) {
    try {
      const { id } = req.params;

      // ตรวจสอบว่าผู้บรรยายมีอยู่หรือไม่
      const [existingRows2] = await db.execute(
        'SELECT * FROM speakers WHERE id = ? AND status = "active"',
        [id]
      );

      const existingSpeaker = existingRows2 && existingRows2.length ? existingRows2[0] : null;
      if (!existingSpeaker) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผู้บรรยาย'
        });
      }

      // Soft delete - เปลี่ยนสถานะเป็น inactive
      await db.execute(
        'UPDATE speakers SET status = "inactive", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: 'ลบผู้บรรยายเรียบร้อยแล้ว'
      });
    } catch (error) {
      console.error('Error deleting speaker:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถลบผู้บรรยายได้',
        error: error.message
      });
    }
  }

  // ลบไฟล์จาก S3 อย่างถาวร
  static async permanentDeleteSpeaker(req, res) {
    try {
      const { id } = req.params;

      // ดึงข้อมูลผู้บรรยาย
      const [speakerRows] = await db.execute(
        'SELECT * FROM speakers WHERE id = ?',
        [id]
      );

      const speaker = speakerRows && speakerRows.length ? speakerRows[0] : null;
      if (!speaker) {
        return res.status(404).json({
          success: false,
          message: 'ไม่พบข้อมูลผู้บรรยาย'
        });
      }

      // ลบไฟล์จาก S3
      const deletePromises = [];
      
      if (speaker.photo_key) {
        deletePromises.push(
          s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: speaker.photo_key,
          }))
        );
      }
      
      if (speaker.pdf_key) {
        deletePromises.push(
          s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: speaker.pdf_key,
          }))
        );
      }

      await Promise.all(deletePromises);
      console.log('🗑️ Speaker files deleted from S3');

      // ลบข้อมูลจากฐานข้อมูล
      await db.execute('DELETE FROM speakers WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'ลบผู้บรรยายและไฟล์ทั้งหมดเรียบร้อยแล้ว'
      });
    } catch (error) {
      console.error('Error permanently deleting speaker:', error);
      res.status(500).json({
        success: false,
        message: 'ไม่สามารถลบผู้บรรยายอย่างถาวรได้',
        error: error.message
      });
    }
  }
}

module.exports = SpeakerController;