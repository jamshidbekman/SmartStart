import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { MailService } from './mail.service';
import { RedisService } from './redis.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}
  async register(createUserDto: CreateUserDto, res: Response) {
    const findUserByEmail = await this.usersService.getUserByEmail(
      createUserDto.email,
    );

    if (findUserByEmail)
      throw new BadRequestException(
        "Bunday email bilan avval ro'yxatdan o'tilgan",
      );

    const user = await this.usersService.createUser(createUserDto);

    const payload = { user_id: user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '5d' });

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1 * 3600 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 5 * 24 * 3600 * 1000,
    });

    await this.mailService.sendVerificationLink(user.email);

    return {
      message: 'Foydalanuvchi tizimga muvaffaqqiyatli kirdi',
      data: user,
    };
  }

  async verifyEmail(token: string) {
    if (!token) throw new BadRequestException('Token berilmagan');

    const savedToken = await this.redisService.getToken(token);

    if (!savedToken) {
      throw new HttpException('Token eskirgan', 410);
    }

    try {
      const tokenData = JSON.parse(savedToken);
      const email = tokenData.email;

      const findUser = await this.usersService.getUserByEmail(email);

      if (!findUser)
        throw new BadRequestException(
          'Token xato yoki foydalanuvchi mavjud emas',
        );

      const updateUserEmailStatus =
        await this.usersService.verifyEmailStatus(email);
      if (updateUserEmailStatus) {
        await this.redisService.delToken(token);
        return { message: 'Emailingiz muvaffaqqiyatli tasdiqlandi' };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async resendEmailVerification(user: any) {
    const findUser = await this.usersService.getUserById(user.user_id);

    if (!findUser) throw new UnauthorizedException('Foydalanuvchi topilmadi');

    if (findUser.email_verified)
      return { message: 'Sizning emailingiz allaqachon tasdiqlangan' };

    await this.mailService.sendVerificationLink(findUser.email);

    return {
      message: `Emailni tasdiqlash uchun havola ${findUser.email}ga yuborildi`,
    };
  }

  async login(loginDto: LoginDto, res: Response) {
    const findUser = await this.usersService.getUserByEmail(loginDto.email);

    if (!findUser) throw new UnauthorizedException('Email yoki parol xato');

    const comparePassword = await bcrypt.compare(
      loginDto.password,
      findUser.password,
    );

    if (!comparePassword)
      throw new UnauthorizedException('Email yoki parol xato');

    const payload = { user_id: findUser.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '5d' });
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1 * 3600 * 1000,
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 5 * 24 * 3600 * 1000,
    });

    return {
      message: 'Foydalanuvchi tizimga muvaffaqqiyatli kirdi',
      data: {
        id: findUser.id,
        fullname: findUser.fullname,
        email: findUser.email,
        email_verified: findUser.email_verified,
      },
    };
  }
}
