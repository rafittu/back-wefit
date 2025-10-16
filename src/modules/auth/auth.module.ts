import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../prisma.service';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [],

  controllers: [AuthController],

  providers: [
    PrismaService,
    LocalStrategy,
    AuthService,
  ],
})
export class AuthModule {}
