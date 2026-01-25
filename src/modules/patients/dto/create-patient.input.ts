import { InputType, Field } from '@nestjs/graphql';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class CreatePatientInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(16, 16, { message: 'NIK harus 16 digit' })
  nik?: string;

  @Field()
  @IsISO8601({ strict: true }, { message: 'Format tanggal harus YYYY-MM-DD' })
  birthDate: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber('ID')
  phone?: string;
}
