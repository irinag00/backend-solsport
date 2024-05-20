import { IsMimeType, IsString, MinLength } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsMimeType()
  img: string;
}
