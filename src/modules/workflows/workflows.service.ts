import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateWorkflowInput } from './dto/create-workflow.input';
import { AddStepInput } from './dto/create-step.input';
import { ReorderStepsInput } from './dto/reorder-steps.input';
import { Workflow, WorkflowStep } from 'generated/prisma/client';

@Injectable()
export class WorkflowsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkflowInput: CreateWorkflowInput): Promise<Workflow> {
    return this.prisma.workflow.create({
      data: createWorkflowInput,
    });
  }

  async findAll(): Promise<Workflow[]> {
    return this.prisma.workflow.findMany({
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(id: string): Promise<Workflow> {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!workflow)
      throw new NotFoundException(`Workflow ${id} tidak ditemukan`);
    return workflow;
  }

  async addStep(input: AddStepInput): Promise<WorkflowStep> {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: input.workflowId },
    });
    if (!workflow) throw new NotFoundException('Workflow tidak ditemukan');

    const lastStep = await this.prisma.workflowStep.findFirst({
      where: { workflowId: input.workflowId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastStep ? lastStep.order + 1 : 1;

    return this.prisma.workflowStep.create({
      data: {
        label: input.label,
        order: newOrder,
        workflow: {
          connect: { id: input.workflowId },
        },
      },
    });
  }

  async reorderSteps(input: ReorderStepsInput): Promise<Workflow> {
    await this.findOne(input.workflowId);

    const updatePromises = input.stepIds.map((stepId, index) => {
      return this.prisma.workflowStep.update({
        where: { id: stepId },
        data: { order: index + 1 },
      });
    });

    try {
      await this.prisma.$transaction(updatePromises);

      return this.findOne(input.workflowId);
    } catch {
      throw new InternalServerErrorException('Gagal menyusun ulang step');
    }
  }

  async deleteStep(stepId: string): Promise<boolean> {
    const step = await this.prisma.workflowStep.findUnique({
      where: { id: stepId },
    });
    if (!step) throw new NotFoundException('Step tidak ditemukan');

    await this.prisma.workflowStep.delete({
      where: { id: stepId },
    });

    return true;
  }
}
