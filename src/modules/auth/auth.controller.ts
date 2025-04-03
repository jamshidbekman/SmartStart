import {
  Controller,
  Post,
  Body,
  Res,
  Query,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LoginDto } from './dto/login.dto';
import { StaffLoginDto } from './dto/staff-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  @ApiOperation({ summary: "Ro'yxatdan o'tish" })
  @ApiResponse({
    status: 201,
    description: "Foydalanuvchi muvaffaqqiyatli ro'yxatdan o'tganda",
    example: {
      statusCode: 201,
      message: 'Foydalanuvchi tizimga muvaffaqqiyatli kirdi',
      data: {
        fullname: 'Foydalanuvchi ismi familiyasi',
        email: 'Foydalanuvchi emaili',
        id: 'Database tomonidan yaratilgan foydalanuvchi idsi',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      "Validatsiya xatoliklari parol kuchli emas, email to'g'ri formatda emas shu kabi",
    example: {
      message: ['some validation error', 'some validation error'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 400,
    description: "Email bilan oldin ro'yxatdan o'tilgan bo'lsa",
    example: {
      message: "Bunday email bilan avval ro'yxatdan o'tilgan",
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  async registerController(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.register(createUserDto, res);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Emailni tasdiqlash' })
  @ApiQuery({ name: 'token' })
  @ApiResponse({
    description: 'Token eskirganda',
    status: 410,
    example: {
      message: 'Token eskirgan',
      statusCode: 410,
    },
  })
  @ApiResponse({
    description: 'Queryda token topilmaganda',
    status: 400,
    example: {
      message: 'Token berilmagan',
      statusCode: 400,
    },
  })
  @ApiResponse({
    description: 'Tasdiqlash tokeni ushbu foydalanuvchiga tegishli bo`lmasa',
    status: 400,
    example: {
      message: 'Tasdiqlash tokeni ushbu foydalanuvchiga tegishli emas',
      statusCode: 400,
    },
  })
  @ApiResponse({
    description: 'Foydalanuvchi emaili muvaffaqqiyatli tasdiqlanganda',
    status: 200,
    example: {
      message: 'Emailingiz muvaffaqqiyatli tasdiqlandi',
      statusCode: 200,
    },
  })
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @UseGuards(AuthGuard)
  @Post('resend-email-verification')
  @ApiOperation({
    summary:
      "Email tasdiqlash havolasini qayta jo'natish, tizimga kirgan holda",
  })
  @ApiResponse({
    description: 'Foydalanuvchi topilmaganda',
    status: 401,
    example: {
      message: 'Foydalanuvchi topilmadi',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    description: 'Foydalanuvchi emaili allaqachon tasdiqlanganda',
    status: 200,
    example: {
      message: 'Sizning emailingiz allaqachon tasdiqlangan',
      statusCode: 200,
    },
  })
  @ApiResponse({
    description: 'Emailni tasdiqlash uchun havola yuborilganda',
    status: 201,
    example: {
      message: 'Emailni tasdiqlash uchun havola user@example.comga yuborildi',
      statusCode: 201,
    },
  })
  async resendEmailVerificationController(@Req() req) {
    return await this.authService.resendEmailVerification(req.user);
  }

  @ApiOperation({ summary: 'Login: Tizimga kirish' })
  @ApiResponse({
    status: 201,
    description: 'Foydalanuvchi muvaffaqqiyatli tizimga kirganda',
    example: {
      statusCode: 201,
      message: 'Foydalanuvchi tizimga muvaffaqqiyatli kirdi',
      data: {
        id: 'Database tomonidan yaratilgan foydalanuvchi idsi',
        fullname: 'Foydalanuvchi ismi familiyasi',
        email: 'Foydalanuvchi emaili',
        email_verified: 'true or false',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      "Validatsiya xatoliklari: maydon bo'sh bo'lmasligi kerak; shu kabi",
    example: {
      message: ['some validation error', 'some validation error'],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 401,
    description: "Email yoki parol xato bo'lsa",
    example: {
      message: 'Email yoki parol xato',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Post('login')
  async loginController(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.login(loginDto, res);
  }

  @Post('staff/login')
  async loginStaffController(
    @Body() staffLoginDto: StaffLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.loginStaff(staffLoginDto, res);
  }
}
