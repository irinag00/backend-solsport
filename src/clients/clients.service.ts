import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly filesSevice: FilesService,
  ) {}
  async create(createClientDto: CreateClientDto, file: Express.Multer.File) {
    const imgUrl = this.filesSevice.saveFile(file, 'clients');
    const client = this.clientRepository.create({
      ...createClientDto,
      img: imgUrl,
    });
    return await this.clientRepository.save(client);
  }

  async findAll() {
    return await this.clientRepository.find();
  }

  async findOne(id: number) {
    const client = await this.clientRepository.findOneBy({ id });
    if (!client) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return client;
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
    file?: Express.Multer.File,
  ) {
    const client = await this.findOne(id);
    if (file) {
      const fileName = path.basename(client.img);
      this.filesSevice.deleteFile(fileName, 'clients');
      updateClientDto.img = this.filesSevice.saveFile(file, 'clients');
    }

    const { title, img } = updateClientDto;
    return await this.clientRepository.save({
      ...client,
      title,
      img,
    });
  }

  async remove(id: number) {
    const client = await this.findOne(id);
    if (client.img) {
      const fileName = path.basename(client.img);
      this.filesSevice.deleteFile(fileName, 'clients');
    }
    await this.clientRepository.remove(client);
  }
}
