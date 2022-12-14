import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Products } from "./Products";

// enum Type {
//   "species",
//   "product",
// }

@Entity()
export class Categories {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", enum: ["species", "product"], nullable: true })
  type!: string;

  @Column("varchar", { nullable: true })
  name!: string;

  @Column("int", { nullable: true })
  parent_id!: number;

  @Column("datetime", { nullable: true })
  createdAt!: string;

  @Column("datetime", { nullable: true })
  updatedAt!: string;

  @OneToMany(() => Products, (products) => products.cate_id)
  @JoinColumn({ name: "id" })
  products!: Products[];
}
