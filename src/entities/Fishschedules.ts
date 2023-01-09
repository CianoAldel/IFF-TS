import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Fishpond } from "./Fishpond";
import { Products } from "./Products";

// enum Type {
//   "species",
//   "product",
// }

@Entity("fish_schedule")
export class Fishschedules {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  products_id!: number;

  @Column("int", { nullable: true })
  user_id!: number;

  @Column("varchar", { nullable: true })
  pond_id!: string;

  @Column("int", { nullable: true })
  event_name!: string;

  @Column("datetime", { nullable: true })
  date_start!: Date;

  @Column("varchar", { nullable: true })
  date_end!: string;

  @Column("varchar", { nullable: true })
  status!: string;

  @ManyToOne(() => Products, (products) => products.fishschedules)
  @JoinColumn({ name: "products_id" })
  products!: Products;

  @ManyToOne(() => Products, (products) => products.fishpond)
  @JoinColumn({ name: "pond_id" })
  fishpond!: Fishpond;
}
