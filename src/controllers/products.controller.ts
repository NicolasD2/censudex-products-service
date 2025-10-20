import {Controller,Get,Post,Patch,Delete,Body,Param,Req,UploadedFile,UseInterceptors, BadRequestException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '../services/products.service';
import { verifyToken } from "../utils/jwt.guard";
import { rolesGuard } from "../utils/roles.guard";

const service = new ProductsService();

@Controller('products')
export class ProductsController {

    @Get()
    async getAll(@Req() req){
        verifyToken(req);
        return service.findAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string){
        return service.findById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(@Req() req, @Body() body, @UploadedFile() file: Express.Multer.File){
        verifyToken(req);
        rolesGuard(req);
        return service.create(body, file?.buffer);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async update(@Req() req, @Param('id') id: string, @Body() body, @UploadedFile() file: Express.Multer.File){
        verifyToken(req);
        rolesGuard(req);
        return service.update(id, body, file?.buffer);
    }

    @Delete(':id')
    async delete(@Req() req, @Param('id') id: string){
        verifyToken(req);
        rolesGuard(req);
        return service.softDelete(id);
    }
}