import {
  BadRequestException,
  Injectable,
  ResponseDecoratorOptions,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const categoryAll = await this.categoryRepository.findOneBy({
      title: createProductDto.category,
    });
    if (!categoryAll) {
      throw new BadRequestException('Category not found');
    }
    const { title, description, category, img } = createProductDto;
    const product = this.productRepository.create({
      title,
      description,
      category: categoryAll,
      img, // img convertida a url
    });

    return await this.productRepository.save(product);
  }

  async findAll() {
    // return `This action returns all products`;
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    return await this.productRepository.findOneBy({ id });
    // return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const categoryAll = await this.categoryRepository.findOneBy({
      title: updateProductDto.category,
    });
    if (!categoryAll) {
      throw new BadRequestException('Category not found');
    }

    const { title, description, category, img } = updateProductDto;
    return await this.productRepository.update(id, {
      title,
      description,
      category: categoryAll,
      img, // img convertida a url
    });
    // return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    return await this.productRepository.delete({ id });
  }
}
