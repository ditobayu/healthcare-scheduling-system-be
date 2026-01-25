import { ObjectType, Field } from '@nestjs/graphql';
import { WorkflowStep } from './workflow-step.entity';

@ObjectType()
export class Workflow {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => [WorkflowStep], { nullable: 'items' })
  steps: WorkflowStep[];
}
