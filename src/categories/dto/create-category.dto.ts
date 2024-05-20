import { IsString, MinLength, IsOptional, IsMimeType } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsMimeType()
  img: string;
}
