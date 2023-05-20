import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { verifyAndDecodeJWTToken } from "src/utilities";

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationToken = request?.headers["authorization"];

    if (authorizationToken) {
      const token = authorizationToken.split(" ")[1];
      const payload = await verifyAndDecodeJWTToken(token);
      if (!payload || !payload.id) return false; //throw new UnauthorizedException;

      return payload && payload.isAdmin;
    }

    return false;
  }
}
