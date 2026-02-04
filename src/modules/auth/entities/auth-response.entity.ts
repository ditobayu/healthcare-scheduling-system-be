import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Role } from 'generated/prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;
}

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;
}
