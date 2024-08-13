import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter';
import { diskStorage } from 'multer';
import { fileName } from './helpers/fileName';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}
  //retonar imagen con url
  @Get('factura/:imageName')
  finefactura(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticFacturaImage(imageName);
    res.sendFile(path);
  }
  //subir imagen factura
  @Post('factura')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/facturas',
        filename: fileName,
      }),
    }),
  )
  createfactura(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No fiel');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/factura/${file.filename}`;
    return {
      secureUrl,
    };
  }
}
