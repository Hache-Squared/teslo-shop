import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
  ){

  }

  async create( createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const hash = await  bcrypt.hash( password, 10 )
      const user = this.userRepository.create({
        ...userData,
        password: hash
      });
      await this.userRepository.save(user);
      
      delete user.password;
      //Retornar JWT
      return user;
    } catch (error) {
      this.handleExceptions(error)
      
    }
  }


  private handleExceptions(error: any):never {
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException(`Please check server logs`);
  }
  
}
