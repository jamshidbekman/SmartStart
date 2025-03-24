import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async register(createUserDto: CreateUserDto) {
    const findUserByEmail = await this.usersService.getUserByEmail(
      createUserDto.email,
    );

    if (findUserByEmail)
      throw new BadRequestException(
        "Bunday email bilan avval ro'yxatdan o'tilgan",
      );

    const user = await this.usersService.createUser(createUserDto);

    return user;
  }
}
