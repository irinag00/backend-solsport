import { Injectable, ResponseDecoratorOptions } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ADDRGETNETWORKPARAMS } from 'dns';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { title, description, category, img } = createProductDto;
    const product = this.productRepository.create({
      title,
      description,
      category,
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
    return await this.productRepository.update(id, updateProductDto);
    // return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    return await this.productRepository.delete({ id });
  }
}
