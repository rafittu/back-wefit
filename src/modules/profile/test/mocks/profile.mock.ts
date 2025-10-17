import { of } from 'rxjs';
import { faker } from '@faker-js/faker';
import { CreateProfileDto } from '../../dto/create-profile.dto';
import {
  ICreateProfile,
  IProfileResponse,
  IAddressResponse,
  ViaCepResponse,
  ProfileWithAddress,
} from '../../interfaces/profile.interface';
import { Profile, ProfileAddress } from '@prisma/client';

// ============================================
// DTOs - Input data for API calls
// ============================================

export const MockCreateProfileDto: CreateProfileDto = {
  cpf: '52998224725',
  name: faker.person.fullName(),
  cellphone: '11999999999',
  email: faker.internet.email().toLowerCase(),
  emailConfirmation: faker.internet.email().toLowerCase(),
  zipCode: '01001000',
  street: 'Praça da Sé',
  number: '100',
  city: 'São Paulo',
  neighborhood: 'Sé',
  state: 'SP',
};

// Ensure emailConfirmation matches email for validation
MockCreateProfileDto.emailConfirmation = MockCreateProfileDto.email;

export const MockCreateProfileDtoWithCNPJ: CreateProfileDto = {
  ...MockCreateProfileDto,
  cpf: undefined,
  cnpj: '11222333000181', // Valid CNPJ
  name: faker.company.name(),
};

export const MockCreateProfileDtoWithPhone: CreateProfileDto = {
  ...MockCreateProfileDto,
  phone: '1133334444',
  complement: faker.location.secondaryAddress(),
};

export const MockCreateProfileDtoWithoutDocuments: Omit<CreateProfileDto, 'cpf' | 'cnpj'> = {
  name: 'Test User',
  cellphone: '11999999999',
  email: 'test@test.com',
  emailConfirmation: 'test@test.com',
  zipCode: '01001000',
  street: 'Test Street',
  number: '100',
  city: 'São Paulo',
  neighborhood: 'Centro',
  state: 'SP',
};

export const MockCreateProfileDtoWithInvalidCPF: CreateProfileDto = {
  ...MockCreateProfileDto,
  cpf: '12345678901',
  cnpj: undefined,
};

export const MockCreateProfileDtoWithInvalidCNPJ: CreateProfileDto = {
  ...MockCreateProfileDtoWithoutDocuments,
  cpf: undefined,
  cnpj: '11111111111111',
};

export const MockCreateProfileDtoWithDifferentCity: CreateProfileDto = {
  ...MockCreateProfileDto,
  city: 'Rio de Janeiro',
};

export const MockCreateProfileDtoWithDifferentState: CreateProfileDto = {
  ...MockCreateProfileDto,
  state: 'RJ',
};

export const MockCreateProfileDtoWithAccentedCity: CreateProfileDto = {
  ...MockCreateProfileDto,
  city: 'São Paulo',
};

// ============================================
// Interfaces - Domain layer data structures
// ============================================

export const MockICreateProfile: ICreateProfile = {
  cpf: MockCreateProfileDto.cpf,
  cnpj: MockCreateProfileDto.cnpj,
  name: MockCreateProfileDto.name,
  cellphone: MockCreateProfileDto.cellphone,
  phone: MockCreateProfileDto.phone,
  email: MockCreateProfileDto.email,
  zipCode: MockCreateProfileDto.zipCode,
  street: MockCreateProfileDto.street,
  number: MockCreateProfileDto.number,
  complement: MockCreateProfileDto.complement,
  neighborhood: MockCreateProfileDto.neighborhood,
  city: MockCreateProfileDto.city,
  state: MockCreateProfileDto.state,
};

export const MockIAddressResponse: IAddressResponse = {
  id: faker.string.uuid(),
  profileId: faker.string.uuid(),
  zipcode: MockCreateProfileDto.zipCode,
  street: MockCreateProfileDto.street,
  number: MockCreateProfileDto.number,
  complement: null,
  neighborhood: MockCreateProfileDto.neighborhood,
  city: MockCreateProfileDto.city,
  state: MockCreateProfileDto.state,
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
};

export const MockIProfileResponse: IProfileResponse = {
  id: MockIAddressResponse.profileId,
  cpf: MockCreateProfileDto.cpf,
  cnpj: null,
  name: MockCreateProfileDto.name,
  cellphone: MockCreateProfileDto.cellphone,
  phone: null,
  email: MockCreateProfileDto.email,
  createdAt: MockIAddressResponse.createdAt,
  updatedAt: MockIAddressResponse.updatedAt,
  address: MockIAddressResponse,
};

// ============================================
// Prisma Entities - Database layer
// ============================================

export const MockProfile: Profile = {
  id: MockIProfileResponse.id,
  cnpj: MockIProfileResponse.cnpj,
  cpf: MockIProfileResponse.cpf,
  name: MockIProfileResponse.name,
  cellphone: MockIProfileResponse.cellphone,
  phone: MockIProfileResponse.phone,
  email: MockIProfileResponse.email,
  createdAt: new Date(MockIProfileResponse.createdAt),
  updatedAt: new Date(MockIProfileResponse.updatedAt),
};

export const MockProfileAddress: ProfileAddress = {
  id: MockIAddressResponse.id,
  profileId: MockIAddressResponse.profileId,
  zipcode: MockIAddressResponse.zipcode,
  street: MockIAddressResponse.street,
  number: MockIAddressResponse.number,
  complement: MockIAddressResponse.complement,
  neighborhood: MockIAddressResponse.neighborhood,
  city: MockIAddressResponse.city,
  state: MockIAddressResponse.state,
  createdAt: new Date(MockIAddressResponse.createdAt),
  updatedAt: new Date(MockIAddressResponse.updatedAt),
};

export const MockProfileWithAddress: ProfileWithAddress = {
  ...MockProfile,
  address: MockProfileAddress,
};

// Variations for Repository tests
export const MockICreateProfileWithCNPJ: ICreateProfile = {
  ...MockICreateProfile,
  cpf: undefined,
  cnpj: '11222333000181',
};

export const MockICreateProfileWithOptionals: ICreateProfile = {
  ...MockICreateProfile,
  phone: '1133334444',
  complement: 'Apt 101',
};

export const MockICreateProfileWithoutOptionals: ICreateProfile = {
  ...MockICreateProfile,
  phone: undefined,
  complement: undefined,
};

export const MockProfileWithCNPJ: ProfileWithAddress = {
  ...MockProfileWithAddress,
  cpf: null,
  cnpj: '11222333000181',
};

// ============================================
// External API Responses
// ============================================

export const MockViaCepResponse: ViaCepResponse = {
  logradouro: MockCreateProfileDto.street,
  bairro: MockCreateProfileDto.neighborhood,
  localidade: MockCreateProfileDto.city,
  uf: MockCreateProfileDto.state,
};

export const MockViaCepErrorResponse: ViaCepResponse = {
  logradouro: '',
  bairro: '',
  localidade: '',
  uf: '',
  erro: true,
};

// ============================================
// HTTP Service Mocks
// ============================================

export const MockHttpService = (viaCepData: ViaCepResponse = MockViaCepResponse) =>
  of({ data: viaCepData });

// ============================================
// Factory Functions (for dynamic test data)
// ============================================

export const createMockProfile = (overrides: Partial<Profile> = {}): Profile => ({
  id: faker.string.uuid(),
  cnpj: null,
  cpf: '52998224725',
  name: faker.person.fullName(),
  cellphone: '11999999999',
  phone: null,
  email: faker.internet.email().toLowerCase(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const createMockProfileAddress = (
  profileId: string,
  overrides: Partial<ProfileAddress> = {},
): ProfileAddress => ({
  id: faker.string.uuid(),
  profileId: profileId,
  zipcode: '01001000',
  street: faker.location.street(),
  number: faker.location.buildingNumber(),
  complement: null,
  neighborhood: faker.location.county(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const createMockProfileWithAddress = (
  overrides: Partial<ProfileWithAddress> = {},
): ProfileWithAddress => {
  const profile = createMockProfile(overrides);
  const address = createMockProfileAddress(profile.id, overrides.address);
  
  return {
    ...profile,
    address,
    ...overrides,
  };
};

export const createMockViaCepResponse = (overrides: Partial<ViaCepResponse> = {}): ViaCepResponse => ({
  logradouro: faker.location.street(),
  bairro: faker.location.county(),
  localidade: faker.location.city(),
  uf: faker.location.state({ abbreviated: true }),
  ...overrides,
});
