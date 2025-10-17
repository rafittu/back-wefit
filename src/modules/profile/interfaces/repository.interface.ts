import { ICreateProfile, ProfileWithAddress } from './profile.interface';

export interface IProfileRepository {
  createProfile(data: ICreateProfile): Promise<ProfileWithAddress>;
}
