import {
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './services/auth.service';
import { IAuthRequest, IUserPayload, IUserToken } from './interfaces/auth.interface';
import { isPublic } from 'src/common/decorators/is-public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseFilters(new HttpExceptionFilter())
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @isPublic()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: IAuthRequest): Promise<IUserToken> {
    const { user } = req;

    return await this.authService.execute(user);
  }

  @Get('/me')
  getMe(@CurrentUser() user: IUserPayload): IUserPayload {
    return user;
  }
}
