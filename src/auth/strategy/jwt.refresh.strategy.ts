import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

interface UserPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.cookies?.refreshToken;
        if (!token) {
          throw new UnauthorizedException('Refresh token missing');
        }
        return token;
      },
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserPayload) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
