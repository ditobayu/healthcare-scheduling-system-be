import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Role } from 'generated/prisma/client';

registerEnumType(Role, {
  name: 'Role', // Nama enum di GraphQL Schema (akan jadi export enum Role di frontend)
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

  // Token tidak kita return di body response, tapi lewat cookie.
  // Namun, untuk fleksibilitas (misal mobile app), bisa di-return field accessToken jika mau.
}
