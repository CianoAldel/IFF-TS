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
  product_id!: number;

  @Column("int", { nullable: true })
  user_id!: number | null;

  @Column("int", { nullable: true })
  pond_id!: number;

  @Column("int", { nullable: true })
  event_status!: string;

  @Column("datetime", { nullable: true })
  date_start!: Date;

  @Column("datetime", { nullable: true })
  date_end!: Date;

  @Column("varchar", { nullable: true })
  status!: string;

  @Column("varchar", { nullable: true })
  manage_status!: string;

  date_status!: string;

  @ManyToOne(() => Products, (products) => products.fishschedules)
  @JoinColumn({ name: "product_id" })
  products!: Products;

  @ManyToOne(() => Fishpond, (fishpond) => fishpond.fishschedules)
  @JoinColumn({ name: "pond_id" })
  fishpond!: Fishpond;
}
