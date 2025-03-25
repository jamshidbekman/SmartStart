import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

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
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = this.UserRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: 'user',
    });
    const createdUser = await this.UserRepository.save(user);
    return {
      fullname: createdUser.fullname,
      email: createdUser.email,
      id: createdUser.id,
    };
  }

  async verifyEmailStatus(email: string) {
    const findUser = await this.UserRepository.findOne({
      where: { email: email },
    });

    if (!findUser) throw new Error('Foydalanuvchi topilmadi');

    await this.UserRepository.update(
      { email: email },
      { email_verified: true },
    );

    return true;
  }

  async getUserById(id: string) {
    return await this.UserRepository.findOneBy({ id: id });
  }
}
