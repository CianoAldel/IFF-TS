import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne, CreateDateColumn } from "typeorm";
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

  @Column({ type: "int", nullable: true })
  user_id!: number;

  // @Column("varchar", { nullable: true })
  // width!: string;

  // @Column("int", { nullable: true })
  // length!: number;

  @Column("float", { nullable: true })
  weight!: number;

  @Column("varchar", { nullable: true })
  size!: string;

  @Column("varchar", { nullable: true })
  note!: string;

  @Column("datetime", { nullable: true })
  history_date!: Date;

  // @Column("varchar", { nullable: true })
  // grade!: string;

  // @Column("varchar", { nullable: true })
  // status!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => Products, (products) => products.id)
  @JoinColumn({ name: "product_id" })
  products!: Products;
}
