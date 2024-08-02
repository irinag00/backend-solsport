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
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('materials')
@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMaterialDto: CreateMaterialDto,
  ) {
    if (!file) {
      throw new HttpException(
        'No se ha proporcionado ninguna imagen',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.materialsService.create(createMaterialDto, file);
  }

  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.materialsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    try {
      return this.materialsService.update(id, updateMaterialDto, file);
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el material',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.materialsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Material eliminado correctamente',
    };
  }
}
