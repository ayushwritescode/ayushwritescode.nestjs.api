import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from './strategy/jwt.access.strategy';
import { JwtRefreshStrategy } from './strategy/jwt.refresh.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: config.get<string | number>('JWT_ACCESS_EXPIRES') }
      })
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [PassportModule],
})
export class AuthModule {}