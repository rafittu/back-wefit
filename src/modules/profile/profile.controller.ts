import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('profile')
export class ProfileController {
  constructor() {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return 'profile created';
  }
}
