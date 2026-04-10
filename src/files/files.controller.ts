import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res, StreamableFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  async findProductImage(
    @Param('imageName') imageName: string
  ){
    const extension = imageName.split('.')[1];
    const file = await this.filesService.getStaticProductImage(imageName);
    // res.status(403).json({
    //   ok: false,
    //   path: path
    // });
    // return res.sendFile(path);

    return new StreamableFile(
      file,
      {
        type: `image/${extension}`,
        disposition: `inline; filename="${imageName}"`
      }
    )
  }

  @Post('product')
  @UseInterceptors( 
    FileInterceptor(
      'file',
      {
        fileFilter: fileFilter,
        // limits: { fieldSize: 1000 }
        storage: diskStorage({
          destination: './static/products',
          filename: fileNamer
        })
      }
    ) 
  ) 
  uploadProductFile( 
    @UploadedFile() file: Express.Multer.File
  ){
    console.log({
      file
    });
    
    if(!file){
      throw new BadRequestException('Make sure the file is an image');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`
    return {
      secureUrl
    };
  }
}
