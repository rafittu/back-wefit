import 'reflect-metadata';
import { CreateProfileService } from '../services/create-profile.service';
import {
  MockProfileWithAddress,
  MockCreateProfileDto,
  MockCreateProfileDtoWithCNPJ,
  MockCreateProfileDtoWithPhone,
  MockCreateProfileDtoWithoutDocuments,
  MockCreateProfileDtoWithInvalidCPF,
  MockCreateProfileDtoWithInvalidCNPJ,
  MockCreateProfileDtoWithDifferentCity,
  MockCreateProfileDtoWithDifferentState,
  MockCreateProfileDtoWithAccentedCity,
  MockViaCepResponse,
  createMockViaCepResponse,
} from './mocks/profile.mock';
import { AppError } from '../../../common/errors/Error';
import { of, throwError } from 'rxjs';

describe('CreateProfileService', () => {
  let service: CreateProfileService;
  let profileRepository: jest.Mocked<any>;
  let httpService: jest.Mocked<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    profileRepository = {
      createProfile: jest.fn(),
    };

    httpService = {
      get: jest.fn(),
    };

    service = new CreateProfileService(profileRepository, httpService);
  });

  describe('Success Scenarios', () => {
    beforeEach(() => {
      httpService.get.mockReturnValue(of({ data: MockViaCepResponse }));
      profileRepository.createProfile.mockResolvedValue(MockProfileWithAddress);
    });

    it('should create profile with valid CPF', async () => {
      const result = await service.execute(MockCreateProfileDto);

      expect(profileRepository.createProfile).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        id: expect.any(String),
        email: MockProfileWithAddress.email,
        name: MockProfileWithAddress.name,
      });
      expect(typeof result.createdAt).toBe('string');
    });

    it('should create profile with valid CNPJ', async () => {
      const result = await service.execute(MockCreateProfileDtoWithCNPJ);
      
      expect(result).toMatchObject({
        id: expect.any(String),
        email: expect.any(String),
        name: expect.any(String),
        cnpj: null,
      });
      expect(result.address).toBeDefined();
    });

    it('should create profile with optional fields', async () => {
      const result = await service.execute(MockCreateProfileDtoWithPhone);
      
      expect(result).toMatchObject({
        id: expect.any(String),
        phone: null,
      });
      expect(result.address).toBeDefined();
    });

    it('should merge ViaCEP data and remove emailConfirmation', async () => {
      await service.execute(MockCreateProfileDto);
      const savedData = profileRepository.createProfile.mock.calls[0][0];
      expect(savedData.street).toBeDefined();
      expect(savedData).not.toHaveProperty('emailConfirmation');
    });
  });

  describe('Document Validation', () => {
    beforeEach(() => {
      httpService.get.mockReturnValue(of({ data: MockViaCepResponse }));
      profileRepository.createProfile.mockResolvedValue(MockProfileWithAddress);
    });

    it('should throw when both CPF and CNPJ are missing', async () => {
      await expect(service.execute(MockCreateProfileDtoWithoutDocuments as any)).rejects.toMatchObject({
        internalCode: 'profile-service.createProfile',
        code: 400,
        message: 'missing CPF or CNPJ',
      });
    });

    it('should throw when CPF is invalid', async () => {
      await expect(service.execute(MockCreateProfileDtoWithInvalidCPF)).rejects.toMatchObject({
        internalCode: 'profile-service.createProfile',
        code: 400,
        message: 'provided CPF is invalid.',
      });
    });

    it('should throw when CNPJ is invalid', async () => {
      await expect(service.execute(MockCreateProfileDtoWithInvalidCNPJ)).rejects.toMatchObject({
        internalCode: 'profile-service.createProfile',
        code: 400,
        message: 'provided CNPJ is invalid.',
      });
    });
  });

  describe('ViaCEP Integration', () => {
    it('should call ViaCEP with correct URL', async () => {
      httpService.get.mockReturnValue(of({ data: MockViaCepResponse }));
      profileRepository.createProfile.mockResolvedValue(MockProfileWithAddress);
      
      await service.execute(MockCreateProfileDto);
      
      expect(httpService.get).toHaveBeenCalledWith(
        `https://viacep.com.br/ws/${MockCreateProfileDto.zipCode}/json/`
      );
    });

    it('should throw when ViaCEP returns error', async () => {
      httpService.get.mockReturnValue(
        of({ data: { ...MockViaCepResponse, erro: true } })
      );

      await expect(service.execute(MockCreateProfileDto)).rejects.toMatchObject({
        internalCode: 'create-profile.getAddress',
        code: 400,
      });
    });

    it('should throw on network error', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      await expect(service.execute(MockCreateProfileDto)).rejects.toMatchObject({
        internalCode: 'create-profile.getAddress',
        code: 400,
      });
    });
  });

  describe('Address Validation', () => {
    it('should throw when city does not match', async () => {
      httpService.get.mockReturnValue(
        of({
          data: createMockViaCepResponse({
            localidade: 'São Paulo',
            uf: MockCreateProfileDtoWithDifferentCity.state,
          }),
        })
      );

      await expect(service.execute(MockCreateProfileDtoWithDifferentCity)).rejects.toMatchObject({
        internalCode: 'create-profile.addressMismatch',
        code: 400,
      });
    });

    it('should throw when state does not match', async () => {
      httpService.get.mockReturnValue(
        of({
          data: createMockViaCepResponse({
            localidade: MockCreateProfileDtoWithDifferentState.city,
            uf: 'SP',
          }),
        })
      );

      await expect(service.execute(MockCreateProfileDtoWithDifferentState)).rejects.toMatchObject({
        internalCode: 'create-profile.addressMismatch',
        code: 400,
      });
    });

    it('should normalize accents in city comparison', async () => {
      httpService.get.mockReturnValue(
        of({
          data: createMockViaCepResponse({
            localidade: 'Sao Paulo',
            uf: MockCreateProfileDtoWithAccentedCity.state,
          }),
        })
      );
      profileRepository.createProfile.mockResolvedValue(MockProfileWithAddress);

      const result = await service.execute(MockCreateProfileDtoWithAccentedCity);
      
      expect(result).toBeDefined();
      expect(result.address.city).toBe('São Paulo');
    });
  });

  describe('Repository Integration', () => {
    it('should propagate AppError from repository', async () => {
      const repoError = new AppError('profile-repository.createProfile', 409, 'Email exists');
      
      httpService.get.mockReturnValue(of({ data: MockViaCepResponse }));
      profileRepository.createProfile.mockRejectedValue(repoError);

      await expect(service.execute(MockCreateProfileDto)).rejects.toBe(repoError);
    });

    it('should wrap unexpected repository errors', async () => {
      httpService.get.mockReturnValue(of({ data: MockViaCepResponse }));
      profileRepository.createProfile.mockRejectedValue(new Error('DB error'));

      await expect(service.execute(MockCreateProfileDto)).rejects.toMatchObject({
        internalCode: 'profile-service.createProfile',
        code: 500,
      });
    });
  });
});
