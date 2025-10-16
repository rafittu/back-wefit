import {
  Controller,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './services/auth.service';
import { IAuthRequest, IUserToken } from './interfaces/auth.interface';

@UseFilters(new HttpExceptionFilter())
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: IAuthRequest): Promise<IUserToken> {
    const { user } = req;

    return await this.authService.execute(user);
  }
}
