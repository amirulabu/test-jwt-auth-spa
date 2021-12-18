import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from './../prisma.service';
import { Module } from '@nestjs/common';
import { UsersService } from './../users/users.service';
import { AuthController } from './auth.controller';
import { TokensService } from './tokens.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '5m',
      },
    }),
  ],
  providers: [UsersService, TokensService, PrismaService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
