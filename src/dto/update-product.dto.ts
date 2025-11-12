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
	@IsNumber()
	price?: number;

	@IsOptional()
	@IsString()
	category?: string;

}
