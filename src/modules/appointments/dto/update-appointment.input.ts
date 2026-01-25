import { CreateAppointmentInput } from './create-appointment.input';
import {
  InputType,
  Field,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { AppointmentStatus } from 'generated/prisma/enums';

registerEnumType(AppointmentStatus, {
  name: 'AppointmentStatus',
});

@InputType()
export class UpdateAppointmentInput extends PartialType(
  CreateAppointmentInput,
) {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Field(() => AppointmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
