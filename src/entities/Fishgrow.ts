import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Products } from "./Products";

// enum Type {
//   "species",
//   "product",
// }

@Entity("fish_grow")
export class Fishgrow {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column({ type: "varchar", nullable: true })
  product_id!: string;

  @Column("varchar", { nullable: true })
  width!: string;

  @Column("int", { nullable: true })
  length!: number;

  @Column("varchar", { nullable: true })
  grade!: string;

  @Column("float", { nullable: true })
  weight!: number;

  @Column("varchar", { nullable: true })
  note!: string;

  @Column("varchar", { nullable: true })
  status!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => Products, (products) => products.id)
  @JoinColumn({ name: "product_id" })
  products!: Products;
}
