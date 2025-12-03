const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  // For development, use Gmail SMTP
  // In production, replace with your actual email service
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Send email to submitter
const sendEmailToSubmitter = async (to, subject, message, submissionData) => {
  try {
    const transporter = createTransporter();
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Sarabun', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .submission-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .submission-info p { margin: 5px 0; }
          .message-box { background: #fff7ed; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          strong { color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">📧 ข้อความจาก SACIT Symposium</h1>
            <p style="margin: 10px 0 0 0;">คณะกรรมการตรวจสอบผลงาน</p>
          </div>
          <div class="content">
            <p>เรียน คุณ${submissionData.author},</p>
            
            <div class="submission-info">
              <p><strong>ผลงานของคุณ:</strong> ${submissionData.title}</p>
              <p><strong>ประเภท:</strong> ${submissionData.type}</p>
              <p><strong>วันที่ส่ง:</strong> ${submissionData.submissionDate}</p>
            </div>
            
            <div class="message-box">
              <h3 style="margin-top: 0; color: #f59e0b;">💬 ข้อความจากผู้ประเมิน:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            
            <p>หากมีข้อสงสัยเพิ่มเติม กรุณาติดต่อกลับที่อีเมลนี้</p>
            
            <p style="margin-top: 30px;">
              ขอแสดงความนับถือ,<br>
              <strong>คณะกรรมการตรวจสอบผลงาน</strong><br>
              SACIT Symposium 2025
            </p>
            
            <div class="footer">
              <p>อีเมลนี้ส่งจากระบบจัดการงาน SACIT Symposium</p>
              <p>หากคุณไม่ได้ลงทะเบียน กรุณาเพิกเฉยต่ออีเมลนี้</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"SACIT Symposium" <${process.env.EMAIL_USER || 'noreply@sacit.com'}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      text: message // Plain text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'ส่งอีเมลสำเร็จ'
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    
    // Return error but don't throw - allow the app to continue
    return {
      success: false,
      message: 'ไม่สามารถส่งอีเมลได้: ' + error.message,
      error: error
    };
  }
};

module.exports = {
  createTransporter,
  sendEmailToSubmitter
};

