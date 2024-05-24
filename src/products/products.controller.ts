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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    try {
      if (!file) {
        throw new HttpException(
          'No se ha proporcionado ninguna imagen',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.productsService.create(createProductDto, file);
    } catch (error) {
      throw new HttpException(
        'Error al cargar la imagen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      if (!file) {
        throw new HttpException(
          'No se ha proporcionado ninguna imagen',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.productsService.update(id, updateProductDto, file);
    } catch (error) {
      throw new HttpException(
        'Error al cargar la imagen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.productsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Producto eliminado correctamente',
    };
  }
}
