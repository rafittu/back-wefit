import { IProfileResponse, ProfileWithAddress } from './profile.interface';

export const mapProfileToResponse = (createdProfile: ProfileWithAddress): IProfileResponse => {
  return {
    id: createdProfile.id,
    cnpj: createdProfile.cnpj ?? null,
    cpf: createdProfile.cpf ?? null,
    name: createdProfile.name,
    cellphone: createdProfile.cellphone,
    phone: createdProfile.phone ?? null,
    email: createdProfile.email,
    createdAt: createdProfile.createdAt.toISOString(),
    updatedAt: createdProfile.updatedAt.toISOString(),
    address: {
      id: createdProfile.address.id,
      profileId: createdProfile.address.profileId,
      zipcode: createdProfile.address.zipcode,
      neighborhood: createdProfile.address.neighborhood,
      city: createdProfile.address.city,
      state: createdProfile.address.state,
      street: createdProfile.address.street,
      number: createdProfile.address.number,
      complement: createdProfile.address.complement ?? null,
      createdAt: createdProfile.address.createdAt.toISOString(),
      updatedAt: createdProfile.address.updatedAt.toISOString(),
    },
  } as IProfileResponse;
};
