import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { WorkflowsService } from './workflows.service';
import { Workflow } from './entities/workflow.entity';
import { WorkflowStep } from './entities/workflow-step.entity';
import { CreateWorkflowInput } from './dto/create-workflow.input';
import { AddStepInput } from './dto/create-step.input';
import { ReorderStepsInput } from './dto/reorder-steps.input';

import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Resolver(() => Workflow)
@UseGuards(GqlAuthGuard, RolesGuard)
export class WorkflowsResolver {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Query(() => [Workflow], { name: 'workflows' })
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR)
  findAll() {
    return this.workflowsService.findAll();
  }

  @Query(() => Workflow, { name: 'workflow' })
  @Roles(Role.ADMIN, Role.STAFF, Role.DOCTOR)
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.workflowsService.findOne(id);
  }

  @Mutation(() => Workflow)
  @Roles(Role.ADMIN, Role.STAFF)
  createWorkflow(
    @Args('createWorkflowInput') createWorkflowInput: CreateWorkflowInput,
  ) {
    return this.workflowsService.create(createWorkflowInput);
  }

  @Mutation(() => WorkflowStep)
  @Roles(Role.ADMIN, Role.STAFF)
  addWorkflowStep(@Args('addStepInput') addStepInput: AddStepInput) {
    return this.workflowsService.addStep(addStepInput);
  }

  @Mutation(() => Workflow)
  @Roles(Role.ADMIN, Role.STAFF)
  reorderWorkflowSteps(
    @Args('reorderStepsInput') reorderStepsInput: ReorderStepsInput,
  ) {
    return this.workflowsService.reorderSteps(reorderStepsInput);
  }

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  deleteWorkflowStep(@Args('id', { type: () => String }) id: string) {
    return this.workflowsService.deleteStep(id);
  }
}
