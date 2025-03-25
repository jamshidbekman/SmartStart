import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly redisService: RedisService,
    private readonly mailerService: MailerService,
  ) {}

  async sendVerificationLink(email: string) {
    const token = await this.redisService.createToken(email);
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Emailni tasdiqlash',
        html: `
    <div style="text-align: center; font-family: Arial, sans-serif;">
      <h1>Email Tasdiqlash</h1>
      <p>Emailingizni tasdiqlash uchun quyidagi tugmani bosing:</p>
      <a href="http://localhost:4000/api/auth/verify-email?token=${token}" 
         style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
         Emailni Tasdiqlash
      </a>
      <p>Agar siz ro‘yxatdan o‘tmagan bo‘lsangiz, bu xabarni e'tiborsiz qoldiring.</p>
      </div>
      `,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}
