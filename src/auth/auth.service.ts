import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly userService: UserService,
  ) {}


  async generateAccessToken(userId: string, email: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, email },
    );
  }


  async generateRefreshToken(userId: string, email: string): Promise<string> {
    return this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES, 
      },
    );
  }

  async signUp(signUpDto: SignUpDto): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // 1. Create user
    const user = await this.userService.createUser(signUpDto);

    // 2. Generate tokens
    const accessToken = await this.generateAccessToken(user._id, user.email);
    const refreshToken = await this.generateRefreshToken(user._id, user.email);

    return { user, accessToken, refreshToken };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userService.findUserByCredentials(loginDto);

    const accessToken = await this.generateAccessToken(user._id, user.email);
    const refreshToken = await this.generateRefreshToken(user._id, user.email);

    return { user, accessToken, refreshToken };
  }
}
