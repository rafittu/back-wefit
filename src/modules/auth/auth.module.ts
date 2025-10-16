import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../prisma.service';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME as SignOptions['expiresIn'] },
    }),
  ],

  controllers: [AuthController],

  providers: [
    PrismaService,
    LocalStrategy,
    AuthService,
  ],
})
export class AuthModule {}
