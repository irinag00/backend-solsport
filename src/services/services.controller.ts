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
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    if (!file) {
      throw new HttpException(
        'No se ha proporcionado ninguna imagen',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.servicesService.create(createServiceDto, file);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.servicesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    try {
      return this.servicesService.update(id, updateServiceDto, file);
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.servicesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Servicio eliminado correctamente',
    };
  }
}
