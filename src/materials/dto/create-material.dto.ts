import { IsMimeType, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsOptional()
  img: string;
}
