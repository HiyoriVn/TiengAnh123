import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmailService } from './auth/email.service';

async function testEmailConnection() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const emailService = app.get(EmailService);

  console.log('\n🔍 Testing SMTP Connection...\n');
  console.log('SMTP Configuration:');
  console.log('- Host:', process.env.SMTP_HOST);
  console.log('- Port:', process.env.SMTP_PORT);
  console.log('- User:', process.env.SMTP_USER);
  console.log('- From Email:', process.env.SMTP_FROM_EMAIL);
  console.log('- From Name:', process.env.SMTP_FROM_NAME);
  console.log('- Frontend URL:', process.env.FRONTEND_URL);
  console.log('\n');

  try {
    // Test sending a reset password email
    const testEmail = process.env.SMTP_USER || 'test@example.com';
    await emailService.sendResetPasswordEmail(
      testEmail,
      'test-token-123',
      'Test User',
    );
    console.log('\n✅ SUCCESS: Email sent successfully!');
    console.log('Check your inbox:', testEmail);
  } catch (error) {
    console.error('\n❌ ERROR: Failed to send email');
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
  }

  await app.close();
}

testEmailConnection();
