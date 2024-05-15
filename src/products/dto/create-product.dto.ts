import { IsMimeType, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsOptional()
  @IsMimeType()
  img: string;

  @IsOptional()
  category: string;
}
