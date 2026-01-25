import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Patient {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  nik?: string;

  @Field()
  birthDate: Date;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
