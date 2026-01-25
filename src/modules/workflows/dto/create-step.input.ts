import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class AddStepInput {
  @Field()
  @IsNotEmpty()
  @IsUUID()
  workflowId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  label: string;
}
