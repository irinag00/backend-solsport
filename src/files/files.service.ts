// import { Injectable, NotFoundException } from '@nestjs/common';
// import * as path from 'path';
// import * as fs from 'fs';

// @Injectable()
// export class FilesService {
//   private readonly baseUploadPath = path.resolve(
//     __dirname,
//     '..',
//     '..',
//     'uploads',
//   );

//   constructor() {
//     if (!fs.existsSync(this.baseUploadPath)) {
//       fs.mkdirSync(this.baseUploadPath, { recursive: true });
//     }
//   }

//   saveFile(file: Express.Multer.File, entity: string): string {
//     const entityFolderPath = path.join(this.baseUploadPath, entity);
//     if (!fs.existsSync(entityFolderPath)) {
//       fs.mkdirSync(entityFolderPath, { recursive: true });
//     }

//     const filePath = path.join(entityFolderPath, file.originalname);
//     fs.writeFileSync(filePath, file.buffer);
//     return `http://localhost:3000/uploads/${entity}/${file.originalname}`;
//   }

//   deleteFile(filePath: string, entity: string): void {
//     const fullFilePath = path.join(this.baseUploadPath, entity, filePath);

//     if (fs.existsSync(fullFilePath)) {
//       fs.unlinkSync(fullFilePath);
//     } else {
//       throw new NotFoundException(`File ${filePath} not found in ${entity}`);
//     }
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as ftp from 'ftp';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class FilesService {
  private readonly ftpConfig = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD,
    port: 21,
  };

  private connectToFtp(): Promise<ftp> {
    return new Promise((resolve, reject) => {
      const client = new ftp();
      client.on('ready', () => resolve(client));
      client.on('error', (err) => reject(err));
      client.connect(this.ftpConfig);
    });
  }

  async saveFile(file: Express.Multer.File, entity: string): Promise<string> {
    const client = await this.connectToFtp();
    const entityFolderPath = `/uploads/${entity}`;
    const ftpFilePath = `${entityFolderPath}/${file.originalname}`;

    return new Promise((resolve, reject) => {
      client.mkdir(entityFolderPath, true, (err) => {
        if (err) {
          client.end();
          return reject(err);
        }

        client.put(file.buffer, ftpFilePath, (err) => {
          client.end();
          if (err) return reject(err);
          resolve(
            `https://sociedadcosmopolita.com.ar/irinagorlino${ftpFilePath}`,
          );
        });
      });
    });
  }

  async deleteFile(filePath: string, entity: string): Promise<void> {
    const client = await this.connectToFtp();
    const fullFilePath = `/uploads/${entity}/${filePath}`;

    return new Promise((resolve, reject) => {
      client.delete(fullFilePath, (err) => {
        client.end();
        if (err) {
          return reject(
            new NotFoundException(`File ${filePath} not found in ${entity}`),
          );
        }
        resolve();
      });
    });
  }
}
