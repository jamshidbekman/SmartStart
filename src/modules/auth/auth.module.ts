import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { MailService } from './mail.service';
import { RedisService } from './redis.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, RedisService],
})
export class AuthModule {}
