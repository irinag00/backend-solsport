import { IsMimeType, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsMimeType()
  img: string;
}
