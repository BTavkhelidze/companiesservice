import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Company = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request, 'req');
    return request.companyId;
  },
);
