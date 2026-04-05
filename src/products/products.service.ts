import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {validate as isUuid} from 'uuid';
@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){

  }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save( product );
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
    
  }

  async findAll(paginationDto : PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;
    return await this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(criteria: string) {
    let product: Product;
    if(isUuid(criteria)){
      product = await this.productRepository.findOneBy({ 
        id: criteria
      });
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: criteria.toUpperCase(),
          slug: criteria.toLowerCase()
        }).getOne();
    }
    
    if(!product){
      throw new NotFoundException(`Product with criteria '${criteria}' not found.`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    })

    if(!product){
      throw new NotFoundException(`Product with id: ${id} not found`);
    }
    try {
      
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productRepository.delete({
      id: id
    });

    return;
  }

  private handleExceptions(error: any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
