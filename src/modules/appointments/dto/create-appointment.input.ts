import { InputType, Field } from '@nestjs/graphql';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateAppointmentInput {
  @Field()
  @IsNotEmpty()
  @IsUUID('4', { message: 'Patient ID tidak valid' })
  patientId: string;

  @Field()
  @IsISO8601(
    { strict: true },
    { message: 'Format tanggal harus ISO8601 (YYYY-MM-DDTHH:mm:ssZ)' },
  )
  date: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
