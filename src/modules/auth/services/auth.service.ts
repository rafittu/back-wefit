import { Injectable } from '@nestjs/common';
import { CredentialsDto } from '../dto/credentials.dto';
import { AppError } from '../../../common/errors/Error';
import {
  IJtwPayload,
  IUserPayload,
  IUserToken,
} from '../interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import { findUserByEmail } from '../mocks/auth.mock';
import { PrismaService } from '../../../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(credentials: CredentialsDto): Promise<IUserPayload> {
    const { email, password } = credentials;

    try {
      const user = findUserByEmail(email); // FIX: find user from DB using PrismaService

      if (user) {
        const isPasswordValid = await this.comparePasswords(
          password,
          user.password,
        );

        if (isPasswordValid) {
          return {
            id: user.id,
            name: user.name,
            email,
          };
        }
      }

      throw new AppError(
        'auth-service.validateUser',
        401,
        'email or password is invalid',
      );
    } catch (error) {
      throw error;
    }
  }

  async execute(user: IUserPayload): Promise<IUserToken> {
    try {
      const payload: IJtwPayload = {
        sub: user.id,
        name: user.name,
        email: user.email,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
      };
    } catch (error) {
      throw new AppError('auth-service.execute', 500, `${error}`);
    }
  }
}
