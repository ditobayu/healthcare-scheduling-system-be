import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { AppointmentFilterInput } from './dto/appointment-filter.input';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentInput: CreateAppointmentInput) {
    const { patientId, date, ...rest } = createAppointmentInput;

    const patientExists = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patientExists) {
      throw new NotFoundException(
        `Pasien dengan ID ${patientId} tidak ditemukan`,
      );
    }

    const appointmentDate = new Date(date);

    return await this.prisma.appointment.create({
      data: {
        ...rest,
        date: appointmentDate,
        patient: {
          connect: { id: patientId },
        },
      },
    });
  }

  async findAll(filter?: AppointmentFilterInput) {
    const where: Prisma.AppointmentWhereInput = {};

    if (filter?.startDate && filter?.endDate) {
      where.date = {
        gte: new Date(filter.startDate),
        lte: new Date(filter.endDate),
      };
    }

    if (filter?.patientId) {
      where.patientId = filter.patientId;
    }

    return await this.prisma.appointment.findMany({
      where,
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment)
      throw new NotFoundException('Appointment tidak ditemukan');
    return appointment;
  }

  async update(id: string, updateAppointmentInput: UpdateAppointmentInput) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, date, ...data } = updateAppointmentInput;

    const updateData: Prisma.AppointmentUpdateInput = { ...data };
    if (date) {
      updateData.date = new Date(date);
    }

    return await this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
  }

  async getPatientByAppointmentId(patientId: string) {
    return await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
  }
}
