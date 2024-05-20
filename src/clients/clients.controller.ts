import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createClientDto: CreateClientDto,
  ) {
    if (!file) {
      throw new HttpException(
        'No se ha proporcionado ninguna imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.clientsService.create(createClientDto, file);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto, file);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.clientsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cliente eliminado correctamente',
    };
  }
}
