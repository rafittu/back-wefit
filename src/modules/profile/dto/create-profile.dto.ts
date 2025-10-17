import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';
import { IsMatch } from '../../../common/decorators/is-match.decorator';

const stripNonNumeric = ({ value }: { value: string | undefined }) =>
  value ? value.replace(/\D/g, '') : value;

const transformEmail = ({ value }: { value: string | undefined }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateProfileDto {
  @IsOptional()
  @Transform(stripNonNumeric)
  @Matches(/^\d{14}$/, { message: 'CNPJ must have 14 digits' })
  cnpj?: string;

  @IsOptional()
  @Transform(stripNonNumeric)
  @Matches(/^\d{11}$/, { message: 'CPF must have 11 digits' })
  cpf?: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Cellphone is required' })
  @Transform(stripNonNumeric)
  @Matches(/^\d{2}9\d{8}$/, {
    message:
      'Cellphone must be a valid Brazilian cellphone (11 digits: DD9XXXXXXXX)',
  })
  cellphone: string;

  @IsOptional()
  @Transform(stripNonNumeric)
  @Matches(/^\d{2}[2-5]\d{7}$/, {
    message: 'Phone must be a valid Brazilian landline (10 digits: DDXXXXXXXX)',
  })
  phone?: string;

  @IsNotEmpty({ message: 'Email is required' })
  @Transform(transformEmail)
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'Email confirmation is required' })
  @Transform(transformEmail)
  @IsEmail({}, { message: 'Email confirmation must be valid' })
  @IsMatch('email', { message: 'Email Confirmation must match Email field' })
  emailConfirmation: string;

  @IsNotEmpty({ message: 'ZipCode (CEP) is required' })
  @Transform(stripNonNumeric)
  @Matches(/^\d{8}$/, { message: 'ZipCode (CEP) must be a valid postal code' })
  zipCode: string;

  @IsNotEmpty({ message: 'Street (logradouro) is required' })
  @IsString()
  street: string;

  @IsNotEmpty({ message: 'Number is required' })
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  city: string;

  @IsNotEmpty({ message: 'Neighborhood (bairro) is required' })
  @IsString()
  neighborhood: string;

  @IsNotEmpty({ message: 'State (UF) is required' })
  @IsString()
  @Length(2, 2, { message: 'State must have 2 characters (e.g., SP, RJ)' })
  state: string;
}
