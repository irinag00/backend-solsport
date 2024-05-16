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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { url } from 'inspector';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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

      const imgProducto = file.originalname;
      const urlImg = `http://localhost:3000/uploads/products/${imgProducto}`;

      // Guardar la imagen en el sistema de archivos
      const fs = require('fs');
      const path = require('path');
      const imageFolder = 'uploads/products';
      const imagePath = path.join(__dirname, '..', '..', imageFolder);
      if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath, { recursive: true });
      }
      fs.writeFileSync(path.join(imagePath, imgProducto), file.buffer);

      //creo el producto con url de la img
      const product = await this.productsService.create({
        ...createProductDto,
        img: urlImg,
      });

      return product;
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
    return this.productsService.findOne(+id);
  }

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

      const imgProducto = file.originalname;
      const urlImg = `http://localhost:3000/uploads/products/${imgProducto}`;

      // Guardar la imagen en el sistema de archivos
      const fs = require('fs');
      const path = require('path');
      const imageFolder = 'uploads/products';
      const imagePath = path.join(__dirname, '..', '..', imageFolder);
      if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath, { recursive: true });
      }
      fs.writeFileSync(path.join(imagePath, imgProducto), file.buffer);

      //creo el producto con url de la img
      const product = this.productsService.update(+id, {
        ...updateProductDto,
        img: urlImg,
      });

      return product;
    } catch (error) {
      throw new HttpException(
        'Error al cargar la imagen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(+id);
  }
}
