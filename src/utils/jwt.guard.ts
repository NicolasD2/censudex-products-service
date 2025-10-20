import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

export function verifyJwtToken(req){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        throw new UnauthorizedException('Token no proporcionado.');
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        throw new UnauthorizedException('Token no válido.');
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return decoded;
    }catch(err){
        throw new UnauthorizedException('Token no válido.');
    }
}
