import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ]
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/easygeneratordb'),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
    }
]
})
export class AppModule { }