import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}


  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({email: email});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
