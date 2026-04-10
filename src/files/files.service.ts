import { join } from 'path';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { createReadStream, existsSync, ReadStream } from 'fs';


@Injectable()
export class FilesService {

    async getStaticProductImage( imageName: string ): Promise<ReadStream>{
        const path = join(__dirname, '../../static/products', imageName);
        if(!existsSync(path)){
            throw new BadRequestException(`No product found with image: ${imageName}`);
        }

        try {
            const file = createReadStream(path);
            return file;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error reading file')
            
        }
    }
}
