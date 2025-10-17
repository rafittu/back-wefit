import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProfileController } from './profile.controller';
import { PrismaService } from '../../prisma.service';
import { ProfileRepository } from './repository/profile.repository';
import { CreateProfileService } from './services/create-profile.service';

@Module({
  imports: [HttpModule.register({ timeout: 9000 })],
  controllers: [ProfileController],
  providers: [PrismaService, ProfileRepository, CreateProfileService],
  exports: [CreateProfileService],
})
export class ProfileModule {}
