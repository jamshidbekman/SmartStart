import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
  ) {}
  async getUserByEmail(email: string) {
    const findUser = await this.UserRepository.findOne({
      where: { email: email },
    });

    return findUser;
  }

  async createUser(createUserDto: CreateUserDto) {
    const findUser = await this.UserRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (findUser) {
      throw new BadRequestException(
        "Bunday email bilan avval ro'yxatdan o'tilgan.",
      );
    }

    const user = this.UserRepository.create(createUserDto);
    const createdUser = await this.UserRepository.save(user);
    return createdUser;
  }
}
