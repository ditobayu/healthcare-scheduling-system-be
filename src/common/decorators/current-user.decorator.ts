import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

interface GraphQLContext {
  req: {
    user?: {
      id: string;
      role: string;
      [key: string]: any;
    };
    headers: Record<string, any>;
  };
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);

    const request = ctx.getContext<GraphQLContext>().req;

    return request.user;
  },
);
