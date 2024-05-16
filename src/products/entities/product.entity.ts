import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  img: string;

  // @Column()
  // category: string;

  @ManyToOne(() => Category, (category) => category.id, {
    eager: true, //trae todas las categorias al hacer findOne
  })
  category: Category;
}
