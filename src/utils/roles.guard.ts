import { ForbiddenException } from "@nestjs/common";

export function rolesGuard(req){
    if(!req.user || req.user.role !== 'admin'){
        throw new ForbiddenException('No tienes permisos para acceder a este recurso.');
    }
}

