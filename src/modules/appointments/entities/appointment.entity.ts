import { ObjectType, Field } from '@nestjs/graphql';
import { AppointmentStatus } from 'generated/prisma/enums';
import { Patient } from '../../patients/entities/patient.entity'; // Import entity Pasien

@ObjectType()
export class Appointment {
  @Field()
  id: string;

  @Field()
  date: Date;

  @Field(() => AppointmentStatus)
  status: AppointmentStatus;

  @Field({ nullable: true })
  diagnosis?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  patientId: string;

  // Field Relasi: Ini akan di-resolve oleh ResolveField
  @Field(() => Patient)
  patient: Patient;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
