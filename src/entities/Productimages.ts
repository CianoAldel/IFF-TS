import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from "typeorm";
import { Products } from "./Products";

enum Type {
  "image",
  "video",
}

@Entity()
export class Productimages {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", enum: ["image", "video"], nullable: true })
  type!: string;

  @Column("int", { nullable: true })
  product_id!: number;

  @Column("varchar", { nullable: true })
  filename!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => Products, (products) => products.productimages)
  @JoinColumn({ name: "product_id" })
  products!: Products;
}
