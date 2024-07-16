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
  private readonly ftpClient: ftp;
  private readonly ftpConfig = {
    host: process.env.FTP_HOST,
    user: process.env.FTP_USERNAME,
    password: process.env.FTP_PASSWORD,
    port: 21,
  };

  constructor() {
    this.ftpClient = new ftp();
    this.ftpClient.connect(this.ftpConfig);
  }

  saveFile(file: Express.Multer.File, entity: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ftpClient.on('ready', () => {
        const entityFolderPath = `/irinagorlino/uploads/${entity}`;
        const ftpFilePath = `${entityFolderPath}/${file.originalname}`;

        this.ftpClient.mkdir(entityFolderPath, true, (err) => {
          if (err) reject(err);

          this.ftpClient.put(file.buffer, ftpFilePath, (err) => {
            if (err) reject(err);
            resolve(`https://sociedadcosmopolita.com.ar${ftpFilePath}`);
            this.ftpClient.end();
          });
        });
      });
    });
  }

  deleteFile(filePath: string, entity: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fullFilePath = `/irinagorlino/uploads/${entity}/${filePath}`;

      this.ftpClient.on('ready', () => {
        this.ftpClient.delete(fullFilePath, (err) => {
          if (err) {
            reject(
              new NotFoundException(`File ${filePath} not found in ${entity}`),
            );
          } else {
            resolve();
          }
          this.ftpClient.end();
        });
      });
    });
  }
}
