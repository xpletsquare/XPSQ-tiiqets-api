import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { verifyAndDecodeJWTToken } from "src/utilities";


@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authorizationToken = request?.headers['authorization'];

    if (authorizationToken) {
      const token = authorizationToken.split(' ')[1];
      const payload = await verifyAndDecodeJWTToken(token);
      if (!payload) return next.handle();

      request.user = payload;
    }

    return next.handle()
  }
}