import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRefreshGuard } from './guard/jwt.refresh.guard';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, accessToken, refreshToken } = await this.authService.signUp(signUpDto);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        message: 'User successfully registered',
        user,
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Logged in successfully',
      user,
      accessToken,
    };
  }


  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {

    const newAccessToken = await this.authService.generateAccessToken(user._id, user.email);
    const newRefreshToken = await this.authService.generateRefreshToken(user._id, user.email);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Refreshed access token',
      accessToken: newAccessToken,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('init')
  async init(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    const newAccessToken = await this.authService.generateAccessToken(user._id, user.email);

    const newRefreshToken = await this.authService.generateRefreshToken(user._id, user.email);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Session initialized',
      user,
      accessToken: newAccessToken,
    };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return {
      message: 'Logged out successfully',
    };
  }
}
