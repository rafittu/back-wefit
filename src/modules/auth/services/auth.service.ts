import { Injectable } from '@nestjs/common';
import { CredentialsDto } from '../dto/credentials.dto';
import { AppError } from '../../../common/errors/Error';
import { IUserPayload } from '../interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import { findUserByEmail } from '../mocks/auth.mock';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
    ) {}

    private async comparePasswords(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    async validateUser(credentials: CredentialsDto) {
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
                'login-service.validateUser',
                401,
                'email or password is invalid',
            );
        } catch (error) {
            throw error;
        }
    }

    async execute(user: IUserPayload) {
        throw new AppError(
            'login-service.validateUser',
            401,
            'method not implemented',
        );
    }
}
