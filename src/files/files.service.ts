import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  getStaticFacturaImage(imageName: string) {
    const path = join(__dirname, '../../static/facturas', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException(`no file ${imageName}`);
    }
    return path;
  }
}
