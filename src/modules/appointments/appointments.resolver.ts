import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { Patient } from '../../modules/patients/entities/patient.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { AppointmentFilterInput } from './dto/appointment-filter.input';

import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => Appointment)
@UseGuards(GqlAuthGuard, RolesGuard)
export class AppointmentsResolver {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Query(() => [Appointment], { name: 'appointments' })
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR)
  findAll(@Args('filter', { nullable: true }) filter?: AppointmentFilterInput) {
    return this.appointmentsService.findAll(filter);
  }

  @Query(() => Appointment, { name: 'appointment' })
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR)
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Mutation(() => Appointment)
  @Roles(Role.ADMIN, Role.STAFF)
  createAppointment(
    @Args('createAppointmentInput')
    createAppointmentInput: CreateAppointmentInput,
  ) {
    return this.appointmentsService.create(createAppointmentInput);
  }

  @Mutation(() => Appointment)
  @Roles(Role.ADMIN)
  updateAppointment(
    @Args('updateAppointmentInput')
    updateAppointmentInput: UpdateAppointmentInput,
  ) {
    return this.appointmentsService.update(
      updateAppointmentInput.id,
      updateAppointmentInput,
    );
  }

  @ResolveField(() => Patient)
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR)
  async patient(@Parent() appointment: Appointment) {
    return this.appointmentsService.getPatientByAppointmentId(
      appointment.patientId,
    );
  }
}
