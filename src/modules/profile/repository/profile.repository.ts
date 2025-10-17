import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { IProfileRepository } from '../interfaces/repository.interface';
import { ICreateProfile, ProfileWithAddress } from '../interfaces/profile.interface';

@Injectable()
export class ProfileRepository implements IProfileRepository {
    constructor(private prisma: PrismaService) {}

    async createProfile(
        data: ICreateProfile
    ): Promise<ProfileWithAddress> {
        const profileData = {
            cpf: data.cpf || null,
            cnpj: data.cnpj || null,
            name: data.name,
            cellphone: data.cellphone,
            phone: data.phone || null,
            email: data.email,
        };

        const profileAddress = {
            zipcode: data.zipCode,
            street: data.street,
            number: data.number,
            complement: data.complement || null,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
        };

        try {
            return await this.prisma.profile.create({
                data: {
                    ...profileData,
                    address: {
                        create: profileAddress,
                    },
                },
                include: {
                    address: true,
                },
            });

        } catch (err: any) {
            if (err?.code === 'P2002') {
                throw new AppError(
                'profile-repository.createProfile',
                409,
                `${err.meta?.target?.[0]} already taken`,
                );
            }

            throw new AppError(
                'profile-repository.createProfile',
                500,
                `profile not created: ${err?.message ?? String(err)}`,
            );
        }
    }
}
