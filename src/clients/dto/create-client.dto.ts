import { IsMimeType, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  img: string;
}
