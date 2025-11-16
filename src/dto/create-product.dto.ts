import { IsString, IsNumber, IsOptional, IsInt, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateProductDto {
  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsString()
  category: string;

}
