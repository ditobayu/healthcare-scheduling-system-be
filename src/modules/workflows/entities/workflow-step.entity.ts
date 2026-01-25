import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class WorkflowStep {
  @Field()
  id: string;

  @Field()
  label: string;

  @Field(() => Int)
  order: number;

  @Field()
  workflowId: string;
}
