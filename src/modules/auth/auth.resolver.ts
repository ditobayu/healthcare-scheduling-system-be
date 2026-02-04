import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse, User } from './entities/auth-response.entity';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { GqlContext } from '../../common/interfaces/gql-context.interface';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => User)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
    @Context() context: GqlContext,
  ) {
    return this.authService.register(registerInput, context.res);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: GqlContext,
  ) {
    return this.authService.login(loginInput, context.res);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser() user: User, @Context() context: GqlContext) {
    return this.authService.logout(user.id, context.res);
  }

  @Mutation(() => AuthResponse)
  async refresh(@Context() context: GqlContext) {
    const refreshToken = context.req.cookies?.['refresh_token'] as
      | string
      | undefined;
    const userId = context.req.cookies?.['user_id'] as string | undefined;

    if (!userId) {
      throw new Error('User ID tidak ditemukan');
    }

    if (!refreshToken) {
      throw new Error('Refresh token tidak ditemukan');
    }

    return this.authService.refresh(userId, refreshToken, context.res);
  }
}
