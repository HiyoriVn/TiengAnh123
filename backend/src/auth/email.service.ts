import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Debug: Log SMTP configuration (remove in production)
    console.log('🔍 SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS,
      passwordLength: process.env.SMTP_PASS?.length,
    });

    // Cấu hình SMTP - sử dụng environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP Connection Error:', error);
      } else {
        console.log('✅ SMTP Server ready to send emails');
      }
    });
  }

  async sendResetPasswordEmail(email: string, token: string, userName: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromName = process.env.SMTP_FROM_NAME || 'TiengAnh123';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Khôi phục mật khẩu - TiengAnh123',
      html: this.getResetPasswordTemplate(resetUrl, userName),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      return { success: true, message: 'Email đã được gửi' };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      throw new Error(
        `Không thể gửi email: ${error.message || 'Unknown error'}`,
      );
    }
  }

  private getResetPasswordTemplate(resetUrl: string, userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background-color: #f0f4f8; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #2D99AE 0%, #0C5776 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; }
          .content h2 { color: #001C44; font-size: 24px; margin-bottom: 20px; }
          .content p { color: #0C5776; line-height: 1.6; font-size: 16px; }
          .button { display: inline-block; background-color: #F8DAD0; color: #001C44; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .button:hover { background-color: #e6c7bd; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 TiengAnh123</h1>
          </div>
          <div class="content">
            <h2>Xin chào ${userName}!</h2>
            <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
            <p>Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
            </div>
            <div class="warning">
              <strong>⏰ Lưu ý:</strong> Liên kết này sẽ hết hạn sau 1 giờ.
            </div>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
            <p>Nếu nút không hoạt động, hãy copy và dán liên kết sau vào trình duyệt:</p>
            <p style="word-break: break-all; color: #2D99AE;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>© 2025 TiengAnh123. All rights reserved.</p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
