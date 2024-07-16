import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly filesService: FilesService,
  ) {}

  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    const categoryAll = await this.categoryRepository.findOneBy({
      title: createProductDto.category,
    });
    if (!categoryAll) {
      throw new BadRequestException('Category not found');
    }
    const imgUrl = await this.filesService.saveFile(file, 'products');
    const { title, description } = createProductDto;
    const product = this.productRepository.create({
      title,
      description,
      category: categoryAll,
      img: imgUrl,
    });

    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const product = await this.findOne(id);
    const categoryAll = await this.categoryRepository.findOneBy({
      title: updateProductDto.category,
    });
    if (!categoryAll) {
      throw new BadRequestException('Category not found');
    }

    if (file) {
      const fileName = path.basename(product.img);
      this.filesService.deleteFile(fileName, 'products');
      updateProductDto.img = await this.filesService.saveFile(file, 'products');
    }

    const { title, description, img } = updateProductDto;
    return await this.productRepository.save({
      ...product,
      title,
      description,
      category: categoryAll,
      img,
    });
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (product.img) {
      const fileName = path.basename(product.img);
      await this.filesService.deleteFile(fileName, 'products');
    }
    return await this.productRepository.remove(product);
  }
}
