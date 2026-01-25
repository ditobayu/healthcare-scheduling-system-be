import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { PatientFilterInput } from './dto/patient-filter.input';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPatientInput: CreatePatientInput) {
    if (createPatientInput.nik) {
      const existing = await this.prisma.patient.findUnique({
        where: { nik: createPatientInput.nik },
      });
      if (existing) throw new ConflictException('NIK Pasien sudah terdaftar');
    }

    try {
      return await this.prisma.patient.create({
        data: {
          ...createPatientInput,
          birthDate: new Date(createPatientInput.birthDate),
        },
      });
    } catch {
      throw new InternalServerErrorException('Gagal membuat pasien');
    }
  }

  async findAll(filter?: PatientFilterInput) {
    const where: Prisma.PatientWhereInput = {};

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search } },
        { nik: { contains: filter.search } },
      ];
    }

    return await this.prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });
    if (!patient)
      throw new NotFoundException(`Pasien dengan ID ${id} tidak ditemukan`);
    return patient;
  }

  async update(id: string, updatePatientInput: UpdatePatientInput) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, birthDate, ...data } = updatePatientInput;

    const updateData: Prisma.PatientUpdateInput = { ...data };

    if (birthDate) {
      updateData.birthDate = new Date(birthDate);
    }

    return await this.prisma.patient.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.patient.delete({
      where: { id },
    });
  }
}
