import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/api-key.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  async generate(): Promise<ApiKey> {
    const key = uuidv4();
    const apiKey = this.apiKeyRepository.create({ key });
    return this.apiKeyRepository.save(apiKey);
  }

  async validate(key: string): Promise<boolean> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { key } });
    return !!apiKey;
  }

  async findAll(): Promise<ApiKey[]> {
    return this.apiKeyRepository.find();
  }
}
