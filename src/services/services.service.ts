import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly filesService: FilesService,
  ) {}
  async create(createServiceDto: CreateServiceDto, file: Express.Multer.File) {
    const imgUrl = this.filesService.saveFile(file, 'services');
    const service = this.serviceRepository.create({
      ...createServiceDto,
      img: imgUrl,
    });
    return await this.serviceRepository.save(service);
  }

  async findAll() {
    return await this.serviceRepository.find();
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException(`Service #${id} not found`);
    }
    return service;
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    file?: Express.Multer.File,
  ) {
    const service = await this.findOne(id);
    if (file) {
      const fileName = path.basename(service.img);
      this.filesService.deleteFile(fileName, 'services');
      updateServiceDto.img = this.filesService.saveFile(file, 'services');
    }
    const { title, img, description } = updateServiceDto;
    return await this.serviceRepository.save({
      ...service,
      title,
      description,
      img,
    });
  }

  async remove(id: number) {
    const service = await this.findOne(id);
    if (service.img) {
      const fileName = path.basename(service.img);
      this.filesService.deleteFile(fileName, 'services');
    }

    await this.serviceRepository.remove(service);
  }
}
