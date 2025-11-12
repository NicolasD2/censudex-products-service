import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verifyJwtToken } from 'src/utils/jwt.guard';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // HTTP
    if (context.getType && context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      verifyJwtToken(req); // lanzará excepción si no es válido
      return true;
    }

    // RPC / gRPC
    const args = context.getArgs();
    // intentamos leer metadata en la posición 1 (dependiendo de Nest version)
    const possibleMetadata = args && args.length > 1 ? args[1] : null;

    let authHeader: string | undefined;
    if (possibleMetadata && typeof possibleMetadata.get === 'function') {
      const arr = possibleMetadata.get('authorization') || possibleMetadata.get('Authorization');
      authHeader = Array.isArray(arr) ? arr[0] : arr;
    } else if (possibleMetadata && possibleMetadata.authorization) {
      authHeader = possibleMetadata.authorization;
    }

    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado (gRPC).');
    }

    // crear un req falso que sea compatible con verifyJwtToken
    const fakeReq: any = { headers: { authorization: authHeader } };
    verifyJwtToken(fakeReq);

    // intentar adjuntar user al objeto call para que otros guards/controllers lo lean
    const possibleCall = args && args.length > 0 ? args[0] : null;
    if (possibleCall) (possibleCall as any).user = fakeReq.user;

    return true;
  }
}
