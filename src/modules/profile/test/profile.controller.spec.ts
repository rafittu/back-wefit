import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../profile.controller';
import { CreateProfileService } from '../services/create-profile.service';
import { 
  MockCreateProfileDto,
  MockIProfileResponse,
} from './mocks/profile.mock';
import { AppError } from '../../../common/errors/Error';

describe('ProfileController', () => {
  let controller: ProfileController;
  let createProfileService: CreateProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: CreateProfileService,
          useValue: {
            execute: jest.fn().mockResolvedValue(MockIProfileResponse),
          },
        }
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    createProfileService = module.get<CreateProfileService>(CreateProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /profile/create', () => {
    it('should call service.execute with DTO and wrap response in { data }', async () => {
      const result = await controller.create(MockCreateProfileDto);

      expect(createProfileService.execute).toHaveBeenCalledTimes(1);
      expect(createProfileService.execute).toHaveBeenCalledWith(MockCreateProfileDto);
      expect(result).toEqual({ data: MockIProfileResponse });
    });

    it('should propagate service errors without modification', async () => {
      const serviceError = new AppError('service.error', 409, 'Email already exists');
      (createProfileService.execute as jest.Mock).mockRejectedValueOnce(serviceError);

      await expect(controller.create(MockCreateProfileDto)).rejects.toBe(serviceError);
      expect(createProfileService.execute).toHaveBeenCalledWith(MockCreateProfileDto);
    });

    it('should propagate generic errors from service', async () => {
      const genericError = new Error('Unexpected error');
      (createProfileService.execute as jest.Mock).mockRejectedValueOnce(genericError);

      await expect(controller.create(MockCreateProfileDto)).rejects.toBe(genericError);
    });
  });
});
