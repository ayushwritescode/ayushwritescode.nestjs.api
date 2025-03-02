import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,

    });
  }

  async validate(payload: any) {
    const { sub } = payload;
    const user = await this.userService.findById(sub);
    if (!user) {
      throw new UnauthorizedException('Invalid user or credentials');
    }
    return user;
  }
}
