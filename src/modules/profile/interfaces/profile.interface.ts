import { Prisma } from '@prisma/client';

export interface ICreateProfile {
  cnpj?: string;
  cpf?: string;
  name: string;
  cellphone: string;
  phone?: string;
  email: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface IAddressResponse {
  id: string;
  profileId: string;
  zipcode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProfileResponse {
  id: string;
  cnpj?: string | null;
  cpf?: string | null;
  name: string;
  cellphone: string;
  phone?: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
  address: IAddressResponse;
}

export type ProfileWithAddress = Prisma.ProfileGetPayload<{
  include: { address: true };
}>;
