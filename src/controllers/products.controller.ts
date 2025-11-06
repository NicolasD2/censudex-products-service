import {Controller,Get,Post,Patch,Delete,Body,Param,Req,UploadedFile,UseInterceptors, BadRequestException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '../services/products.service';
//import { verifyJwtToken } from "../utils/jwt.guard";
//import { rolesGuard, rolesGuard } from "../utils/roles.guard";


@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}
    @Get('get_all')
    async getAll(@Req() req){
        try{
            //verifyJwtToken(req);
            return await this.productService.findAll();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('find/:id')
    async getById(@Param('id') id: string){
        try{
            return await this.productService.findById(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    async create(@Req() req, @Body() body, @UploadedFile() file: Express.Multer.File){
        try{
            //verifyJwtToken(req);
            //rolesGuard(req);
            return await this.productService.create(body, file?.buffer);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Patch('edit/:id')
    @UseInterceptors(FileInterceptor('image'))
    async update(@Req() req, @Param('id') id: string, @Body() body, @UploadedFile() file: Express.Multer.File){
        try{
            //verifyJwtToken(req);
            //rolesGuard(req);
            return await this.productService.update(id, body, file?.buffer);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete('delete/:id')
    async softDelete(@Req() req, @Param('id') id: string){
        try{
            //verifyJwtToken(req);
            //rolesGuard(req);
            return await this.productService.softDelete(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}