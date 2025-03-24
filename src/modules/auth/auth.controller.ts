import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ApiOperation({ summary: "Ro'yxatdan o'tish" })
  @ApiResponse({
    status: 201,
    description: "Foydalanuvchi muvaffaqqiyatli ro'yxatdan o'tdi",
  })
  async registerController(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }
}
