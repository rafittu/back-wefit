import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AppError } from '../../../common/errors/Error';
import { ProfileRepository } from '../repository/profile.repository';
import { IProfileRepository } from '../interfaces/repository.interface';
import { Profile } from '@prisma/client';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { isValidCNPJ, isValidCPF } from 'src/modules/utils/validators';

@Injectable()
export class CreateProfileService {
  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: IProfileRepository<Profile>,
  ) {}

  private async getAddress(zipCode: string) {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${zipCode}/json/`,
      );

      if (response.data.erro) {
        throw new Error('zipCode not found in ViaCEP database');
      }

      return response.data;
    } catch (error) {
      throw new AppError(
        'create-profile.getAddress',
        400,
        `error fetching address from ViaCEP: ${error.message || String(error)}`,
      );
    }
  }

  async execute(
    data: CreateProfileDto,
  ) {
    try {
      if (!data.cnpj && !data.cpf) {
        throw new AppError(
          'profile-service.createProfile',
          400,
          'missing user CPF or CNPJ',
        );
      }

      if (data.cpf && !isValidCPF(data.cpf)) {
        throw new AppError('profile-service.createProfile', 400, 'provided CPF is invalid.');
      }

      if (data.cnpj && !isValidCNPJ(data.cnpj)) {
        throw new AppError('profile-service.createProfile', 400, 'provided CNPJ is invalid.');
      }

      const { logradouro, bairro, localidade, uf } =
        await this.getAddress(data.zipCode);

      const profile = {
        ...data,
        street: logradouro,
        neighborhood: bairro,
        city: localidade,
        state: uf,
      };

      return await this.profileRepository.createInfluencer(profile);

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'profile-service.createProfile',
        500,
        `failed to create profile: ${error.message || String(error)}`,
      );
    }
  }
}
