import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly filesSevice: FilesService,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    const imgUrl = await this.filesSevice.saveFile(file, 'categories');
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      img: imgUrl,
    });
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const category = await this.findOne(id);
    if (file) {
      const fileName = path.basename(category.img);
      this.filesSevice.deleteFile(fileName, 'categories');
      updateCategoryDto.img = await this.filesSevice.saveFile(
        file,
        'categories',
      );
    }

    const { title, img } = updateCategoryDto;
    return await this.categoryRepository.save({
      ...category,
      title,
      img,
    });
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.img) {
      const fileName = path.basename(category.img);
      await this.filesSevice.deleteFile(fileName, 'categories');
    }
    // Verificar si existen productos relacionados con la categoría
    const relatedProducts = await this.productRepository.find({
      where: { category },
    });
    if (relatedProducts.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar la categoría porque tiene productos relacionados',
      );
    }
    await this.categoryRepository.remove(category);
  }
}
