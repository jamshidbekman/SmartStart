import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { MailService } from './mail.service';
import { RedisService } from './redis.service';
import { StaffsModule } from '../staffs/staffs.module';
import { StaffsService } from '../staffs/staffs.service';

@Module({
  imports: [UsersModule, StaffsModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, RedisService, StaffsService],
})
export class AuthModule {}
