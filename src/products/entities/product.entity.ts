import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({
    name: 'products'
})
export class Product {

    @ApiProperty({
        example: '237b2d4d-a44a-47df-a350-c1407b86b015',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shit Teslo',
        description: 'Product Title',
        uniqueItems: true
    })    
    @Column('text',{
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price',
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Lorem',
        description: 'Product description'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt',
        description: 'Product SLUG - For SEO',
    })
    @Column('text',{
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default : 0
    })
    @Column('int',{
        default: 0
    })
    stock: number;
    
    @ApiProperty({
        example: ['M','XL','XXL'],
        description: 'Product SLUG - For SEO',
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product SLUG - For SEO'
    })
    @Column('text')
    gender: string

    @ApiProperty()
    //tags
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]
    
    //images
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    images?: ProductImage[];


    @ManyToOne(
        () => User,
        user => user.product,
        {
            eager: true
        }
    )
    user: User

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'", '');
    }
    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'", '');
    }

}
