import {Controller,Get,Post,Patch,Delete,Body,Param,Req,UploadedFile,UseInterceptors, BadRequestException, UseGuards} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { UpdateProductDto } from 'src/dto/update-product.dto';


@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService){}
    @Get('get_all')
    async getAll(@Req() req){
        try{
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
    async create(@Req() req, @Body() body: CreateProductDto, @UploadedFile() file: Express.Multer.File){
        try{
            return await this.productService.create(body, file?.buffer);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Patch('edit/:id')
    @UseInterceptors(FileInterceptor('image'))
    async update(@Req() req, @Param('id') id: string, @Body() body: UpdateProductDto, @UploadedFile() file: Express.Multer.File){
        try{
            return await this.productService.update(id, body, file?.buffer);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete('delete/:id')
    async softDelete(@Req() req, @Param('id') id: string){
        try{
            return await this.productService.softDelete(id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}