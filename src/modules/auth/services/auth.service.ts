import { Injectable } from '@nestjs/common';
import { CredentialsDto } from '../dto/credentials.dto';
import { AppError } from '../../../common/errors/Error';
import { IUserPayload } from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
    async validateUser(credentials: CredentialsDto) {
        const { email, password } = credentials;

        throw new AppError(
            'login-service.validateUser',
            401,
            'method not implemented',
        );
    }

    async execute(user: IUserPayload) {
        throw new AppError(
            'login-service.validateUser',
            401,
            'method not implemented',
        );
    }
}
