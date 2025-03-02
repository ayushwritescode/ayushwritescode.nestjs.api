import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from 'src/auth/dto/login.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from 'src/auth/dto/signup.dto';


@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private _userModel: Model<User>) {}

  async findUserByCredentials(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this._userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException(
        'This email is not registered yet, please try again or create an account.',
      );
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Password is not correct.');
    }

    return user;
  }

  async createUser(signUpDto: SignUpDto): Promise<User> {

    const { name, email, password } = signUpDto;
    const existingUser = await this._userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException(
        'Email already exists in our database. Log in or try another one.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this._userModel({
      name,
      email,
      password: hashedPassword,
    });

    return await user.save();
  }


  findAll() {
    return `This action returns all user`;
  }

  async findById(id:string) {

    const user = await this._userModel.findById(id);

    if (!user) {
      throw new NotFoundException(
        'User not found, please try again or create an account.',
      );
    }

    return user;
  }

}
