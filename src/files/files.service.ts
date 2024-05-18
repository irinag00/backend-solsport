import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  private readonly baseUploadPath = path.resolve(
    __dirname,
    '..',
    '..',
    'uploads',
  );

  constructor() {
    if (!fs.existsSync(this.baseUploadPath)) {
      fs.mkdirSync(this.baseUploadPath, { recursive: true });
    }
  }

  saveFile(file: Express.Multer.File, entity: string): string {
    const entityFolderPath = path.join(this.baseUploadPath, entity);
    if (!fs.existsSync(entityFolderPath)) {
      fs.mkdirSync(entityFolderPath, { recursive: true });
    }

    const filePath = path.join(entityFolderPath, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/uploads/${entity}/${file.originalname}`;
  }

  deleteFile(filePath: string, entity: string): void {
    const fullFilePath = path.join(this.baseUploadPath, entity, filePath);

    if (fs.existsSync(fullFilePath)) {
      fs.unlinkSync(fullFilePath);
    } else {
      throw new NotFoundException(`File ${filePath} not found in ${entity}`);
    }
  }
}
