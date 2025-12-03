const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const createTransporter = () => {
  // For development, you can use a service like Gmail, SendGrid, or Mailtrap
  // This is a placeholder configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-password'
    }
  });
};

// Send email to submitter
exports.sendEmailToSubmitter = async (req, res) => {
  try {
    const { email, subject, message, submitterName } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุอีเมล, หัวข้อ และข้อความ'
      });
    }

    console.log('📧 Sending email to:', email);
    console.log('📋 Subject:', subject);
    console.log('💬 Message:', message);

    // For now, just log the email (since we don't have SMTP credentials)
    // In production, uncomment the code below
    
    /*
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"SACIT Symposium" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B5CF6;">ข้อความจากคณะกรรมการ SACIT Symposium</h2>
          <p>เรียน คุณ${submitterName},</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            ข้อความนี้ส่งจากระบบจัดการงาน SACIT Symposium 2025<br>
            หากมีข้อสงสัย กรุณาติดต่อ: symposium@sacit.ac.th
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    */

    // Simulate email sent (remove this in production)
    console.log('✅ Email simulated (SMTP not configured yet)');
    console.log('📧 Would send to:', email);
    console.log('📝 Subject:', subject);
    console.log('💬 Message:', message);

    return res.json({
      success: true,
      message: 'ข้อความถูกส่งเรียบร้อยแล้ว',
      // In production, include: messageId: info.messageId
    });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งอีเมล',
      error: error.message
    });
  }
};

// Send bulk email (for announcements)
exports.sendBulkEmail = async (req, res) => {
  try {
    const { emails, subject, message } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุรายการอีเมล'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุหัวข้อและข้อความ'
      });
    }

    console.log(`📧 Sending bulk email to ${emails.length} recipients`);

    // In production, implement actual email sending
    // For now, just log
    emails.forEach((email, index) => {
      console.log(`  ${index + 1}. ${email}`);
    });

    return res.json({
      success: true,
      message: `ส่งอีเมลถึง ${emails.length} ผู้รับเรียบร้อยแล้ว`,
      count: emails.length
    });
  } catch (error) {
    console.error('❌ Error sending bulk email:', error);
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งอีเมล',
      error: error.message
    });
  }
};

