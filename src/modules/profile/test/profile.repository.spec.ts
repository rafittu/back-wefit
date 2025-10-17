import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepository } from '../repository/profile.repository';
import { PrismaService } from '../../../prisma.service';
import {
  MockICreateProfile,
  MockICreateProfileWithCNPJ,
  MockICreateProfileWithOptionals,
  MockICreateProfileWithoutOptionals,
  MockProfileWithAddress,
  MockProfileWithCNPJ,
} from './mocks/profile.mock';

describe('ProfileRepository', () => {
  let repository: ProfileRepository;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      profile: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<ProfileRepository>(ProfileRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    describe('Success Scenarios', () => {
      it('should create profile with address successfully', async () => {
        const mockResult = MockProfileWithAddress;
        prismaService.profile.create.mockResolvedValue(mockResult);

        const result = await repository.createProfile(MockICreateProfile);

        expect(prismaService.profile.create).toHaveBeenCalledTimes(1);
        expect(prismaService.profile.create).toHaveBeenCalledWith({
          data: {
            cpf: MockICreateProfile.cpf,
            cnpj: null,
            name: MockICreateProfile.name,
            cellphone: MockICreateProfile.cellphone,
            phone: null,
            email: MockICreateProfile.email,
            address: {
              create: {
                zipcode: MockICreateProfile.zipCode,
                street: MockICreateProfile.street,
                number: MockICreateProfile.number,
                complement: null,
                neighborhood: MockICreateProfile.neighborhood,
                city: MockICreateProfile.city,
                state: MockICreateProfile.state,
              },
            },
          },
          include: {
            address: true,
          },
        });
        expect(result).toEqual(mockResult);
      });

      it('should create profile with CNPJ instead of CPF', async () => {
        const mockResult = MockProfileWithCNPJ;
        prismaService.profile.create.mockResolvedValue(mockResult);

        const result = await repository.createProfile(MockICreateProfileWithCNPJ);

        expect(prismaService.profile.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              cnpj: '11222333000181',
              cpf: null,
            }),
          })
        );
        expect(result).toEqual(mockResult);
      });

      it('should create profile with optional phone and complement', async () => {
        const mockResult = MockProfileWithAddress;
        prismaService.profile.create.mockResolvedValue(mockResult);

        await repository.createProfile(MockICreateProfileWithOptionals);

        expect(prismaService.profile.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              phone: '1133334444',
              address: expect.objectContaining({
                create: expect.objectContaining({
                  complement: 'Apt 101',
                }),
              }),
            }),
          })
        );
      });

      it('should set null for undefined optional fields', async () => {
        const mockResult = MockProfileWithAddress;
        prismaService.profile.create.mockResolvedValue(mockResult);

        await repository.createProfile(MockICreateProfileWithoutOptionals);

        expect(prismaService.profile.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              phone: null,
              address: expect.objectContaining({
                create: expect.objectContaining({
                  complement: null,
                }),
              }),
            }),
          })
        );
      });
    });

    describe('Unique Constraint Violations (P2002)', () => {
      it('should throw AppError 409 when email already exists', async () => {
        const prismaError = {
          code: 'P2002',
          meta: { target: ['email'] },
        };
        prismaService.profile.create.mockRejectedValue(prismaError);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 409,
          message: 'email already taken',
        });
      });

      it('should throw AppError 409 when CPF already exists', async () => {
        const prismaError = {
          code: 'P2002',
          meta: { target: ['cpf'] },
        };
        prismaService.profile.create.mockRejectedValue(prismaError);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 409,
          message: 'cpf already taken',
        });
      });

      it('should throw AppError 409 when CNPJ already exists', async () => {
        const prismaError = {
          code: 'P2002',
          meta: { target: ['cnpj'] },
        };
        prismaService.profile.create.mockRejectedValue(prismaError);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 409,
          message: 'cnpj already taken',
        });
      });

      it('should throw AppError 409 when cellphone already exists', async () => {
        const prismaError = {
          code: 'P2002',
          meta: { target: ['cellphone'] },
        };
        prismaService.profile.create.mockRejectedValue(prismaError);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 409,
          message: 'cellphone already taken',
        });
      });

      it('should handle multiple fields in P2002 target', async () => {
        const prismaError = {
          code: 'P2002',
          meta: { target: ['email', 'cpf'] },
        };
        prismaService.profile.create.mockRejectedValue(prismaError);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 409,
          message: 'email, cpf already taken',
        });
      });

      it('should handle P2002 without meta.target', async () => {
        const prismaError = {
          code: 'P2002',
          meta: {},
        };
        prismaService.profile.create.mockRejectedValue(prismaError);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 409,
          message: 'field already taken',
        });
      });
    });

    describe('Database Errors', () => {
      it('should wrap generic Prisma errors as 500', async () => {
        const prismaError = new Error('Connection timeout');
        prismaService.profile.create.mockRejectedValue(prismaError);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 500,
          message: 'profile not created: Connection timeout',
        });
      });

      it('should handle Prisma errors without message', async () => {
        const prismaError = { code: 'P1001' };
        prismaService.profile.create.mockRejectedValue(prismaError);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 500,
        });
      });

      it('should handle non-Error exceptions', async () => {
        prismaService.profile.create.mockRejectedValue('String error');

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 500,
          message: 'profile not created: String error',
        });
      });

      it('should handle null/undefined exceptions', async () => {
        prismaService.profile.create.mockRejectedValue(null);

        await expect(repository.createProfile(MockICreateProfile)).rejects.toMatchObject({
          internalCode: 'profile-repository.createProfile',
          code: 500,
        });
      });
    });

    describe('Data Transformation', () => {
      it('should transform ICreateProfile to Prisma schema format', async () => {
        const mockResult = MockProfileWithAddress;
        prismaService.profile.create.mockResolvedValue(mockResult);

        await repository.createProfile(MockICreateProfile);

        const callArgs = prismaService.profile.create.mock.calls[0][0];
        
        expect(callArgs.data).not.toHaveProperty('zipCode');
        expect(callArgs.data.address.create).toHaveProperty('zipcode');
        expect(callArgs.include).toEqual({ address: true });
      });

      it('should include nested address in response', async () => {
        const mockResult = MockProfileWithAddress;
        prismaService.profile.create.mockResolvedValue(mockResult);

        const result = await repository.createProfile(MockICreateProfile);

        expect(result.address).toBeDefined();
        expect(result.address).toHaveProperty('id');
        expect(result.address).toHaveProperty('zipcode');
        expect(result.address).toHaveProperty('street');
      });
    });
  });
});

