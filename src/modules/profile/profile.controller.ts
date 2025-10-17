import { Controller, Post, Body, UseFilters, Inject } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { CreateProfileService } from './services/create-profile.service';
import { IProfileResponse } from './interfaces/profile.interface';

@UseFilters(new HttpExceptionFilter())
@Controller('profile')
export class ProfileController {
  constructor(
    @Inject(CreateProfileService) private readonly createProfile: CreateProfileService,
  ) {}

  @Post('/create')
  async create(@Body() createProfileDto: CreateProfileDto): Promise<{ data: IProfileResponse }> {
    const profile = await this.createProfile.execute(createProfileDto);
    return { data: profile };
  }
}
