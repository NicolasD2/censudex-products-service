import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsInt, Min, MaxLength } from 'class-validator';

export class UpdateProductDto {
	@IsOptional()
	@IsString()
	@MaxLength(150)
	name?: string;

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	description?: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	price?: number;

	@IsOptional()
	@IsString()
	category?: string;

}
