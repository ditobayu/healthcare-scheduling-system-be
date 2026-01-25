import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsUUID, ArrayMinSize } from 'class-validator';

@InputType()
export class ReorderStepsInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  workflowId: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(2)
  @IsUUID('4', { each: true })
  stepIds: string[];
}
