import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    private readonly filesService: FilesService,
  ) {}
  async create(
    createMaterialDto: CreateMaterialDto,
    file: Express.Multer.File,
  ) {
    const imgUrl = await this.filesService.saveFile(file, 'materials');
    const material = this.materialRepository.create({
      ...createMaterialDto,
      img: imgUrl,
    });
    return await this.materialRepository.save(material);
  }

  async findAll() {
    return await this.materialRepository.find();
  }

  async findOne(id: number) {
    const material = await this.materialRepository.findOneBy({ id });
    if (!material) {
      throw new NotFoundException(`Service #${id} not found`);
    }
    return material;
  }

  async update(
    id: number,
    updateMaterialDto: UpdateMaterialDto,
    file?: Express.Multer.File,
  ) {
    const material = await this.findOne(id);
    if (file) {
      const fileName = path.basename(material.img);
      this.filesService.deleteFile(fileName, 'materials');
      updateMaterialDto.img = await this.filesService.saveFile(
        file,
        'materials',
      );
    }
    const { title, img, description } = updateMaterialDto;
    return await this.materialRepository.save({
      ...material,
      title,
      description,
      img,
    });
  }

  async remove(id: number) {
    const material = await this.findOne(id);
    if (material.img) {
      const fileName = path.basename(material.img);
      await this.filesService.deleteFile(fileName, 'materials');
    }

    await this.materialRepository.remove(material);
  }
}
