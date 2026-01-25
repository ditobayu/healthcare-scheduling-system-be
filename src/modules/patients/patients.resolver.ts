import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { PatientFilterInput } from './dto/patient-filter.input';

import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => Patient)
@UseGuards(GqlAuthGuard, RolesGuard)
export class PatientsResolver {
  constructor(private readonly patientsService: PatientsService) {}

  @Query(() => [Patient], { name: 'patients' })
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR)
  findAll(@Args('filter', { nullable: true }) filter?: PatientFilterInput) {
    return this.patientsService.findAll(filter);
  }

  @Query(() => Patient, { name: 'patient' })
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR)
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.patientsService.findOne(id);
  }

  @Mutation(() => Patient)
  @Roles(Role.ADMIN, Role.STAFF)
  createPatient(
    @Args('createPatientInput') createPatientInput: CreatePatientInput,
  ) {
    return this.patientsService.create(createPatientInput);
  }

  @Mutation(() => Patient)
  @Roles(Role.ADMIN)
  updatePatient(
    @Args('updatePatientInput') updatePatientInput: UpdatePatientInput,
  ) {
    return this.patientsService.update(
      updatePatientInput.id,
      updatePatientInput,
    );
  }

  @Mutation(() => Patient)
  @Roles(Role.ADMIN)
  removePatient(@Args('id', { type: () => String }) id: string) {
    return this.patientsService.remove(id);
  }
}
