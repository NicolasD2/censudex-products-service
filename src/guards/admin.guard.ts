import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { rolesGuard } from 'src/utils/roles.guard';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (context.getType && context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      rolesGuard(req);
      return true;
    }

    const args = context.getArgs();
    const possibleCall = args && args.length > 0 ? args[0] : null;
    const user = possibleCall && (possibleCall as any).user;
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso.');
    }
    return true;
  }
}
