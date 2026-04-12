import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService
  ){

  }

  async runSeed(){
    await this.deleteTables();
    const admin = await this.insertUsers();
    await this.insertNewProducts(admin);
    return 'Seed executed';
  }

  private async insertNewProducts(user: User){
    //this.productsService.deleteAllProducts();
    await this.productsService.deleteAllProducts();
    const products = initialData.products;

    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.productsService.create(product, user))
    })

    const results = await Promise.all(insertPromises);
    return true;
  }

  private async deleteTables(){
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const promiseUsers = []
    seedUsers.forEach(user => {
      promiseUsers.push(this.authService.create(user));
    });
    const dbUsers = await Promise.all(promiseUsers);
    return dbUsers[0];
  }
}
