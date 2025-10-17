import { Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AppError } from '../../../common/errors/Error';
import { ProfileRepository } from '../repository/profile.repository';
import { IProfileRepository } from '../interfaces/repository.interface';
import { ViaCepResponse, IProfileResponse, ProfileWithAddress } from '../interfaces/profile.interface';
import { mapProfileToResponse } from '../interfaces/mappers';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { isValidCNPJ, isValidCPF } from 'src/modules/utils/validators';

@Injectable()
export class CreateProfileService {
  constructor(
  @Inject(ProfileRepository)
  private readonly profileRepository: IProfileRepository,
    private readonly httpService: HttpService,
  ) {}

  private validateDocument(data: CreateProfileDto) {
    if (!data.cnpj && !data.cpf)
      throw new AppError('profile-service.createProfile', 400, 'missing CPF or CNPJ');

    if (data.cpf && !isValidCPF(data.cpf))
      throw new AppError('profile-service.createProfile', 400, 'provided CPF is invalid.');

    if (data.cnpj && !isValidCNPJ(data.cnpj))
      throw new AppError('profile-service.createProfile', 400, 'provided CNPJ is invalid.');
  }

  private async getAddress(zipCode: string) {
    try {
      const response: AxiosResponse<ViaCepResponse> = await lastValueFrom(
        this.httpService.get(
          `https://viacep.com.br/ws/${zipCode}/json/`
        )
      );

      if (response.data.erro) {
        throw new Error('zipCode not found in ViaCEP database');
      }

      return response.data;
    } catch (error) {
      throw new AppError(
        'create-profile.getAddress',
        400,
        `error fetching address from ViaCEP: ${error.message || String(error)}`
      );
    }
  }

  private validateAddressMatch(
    providedCity?: string,
    providedState?: string,
    viacepCity?: string,
    viacepState?: string,
  ) {
    const normalize = (str?: string) =>
      str
        ? str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toLowerCase()
        : '';

    const cityMatches =
      !providedCity || normalize(providedCity) === normalize(viacepCity);

    const stateMatches =
      !providedState ||
      providedState.trim().toUpperCase() === (viacepState ?? '').toUpperCase();

    if (!cityMatches || !stateMatches) {
      throw new AppError(
        'create-profile.addressMismatch',
        400,
        'Provided city/state do not match the address returned by ViaCEP',
      );
    }
  }

  async execute(
    data: CreateProfileDto,
  ): Promise<IProfileResponse> {
    try {
      this.validateDocument(data)

      const { logradouro, bairro, localidade, uf } =
        await this.getAddress(data.zipCode);

      this.validateAddressMatch(data.city, data.state, localidade, uf);

      const safeString = (value?: string, fallback?: string) =>
        value && value.trim() ? value.trim() : fallback?.trim() || '';

      const street = safeString(logradouro, data.street);
      const neighborhood = safeString(bairro, data.neighborhood);
      const city = safeString(localidade, data.city);
      const state = safeString(uf, data.state);

      const { emailConfirmation, ...persistable } = data;

      const profileToSave = {
        ...persistable,
        street,
        neighborhood,
        city,
        state,
      };

      const createdProfile = await this.profileRepository.createProfile(profileToSave);

      return mapProfileToResponse(createdProfile as ProfileWithAddress);

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
