import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Products } from "./Products";
import { Fishschedules } from "./Fishschedules";
import { Fishpond } from "./Fishpond";

@Entity("fishschedules_stock")
export class Fishschedulestock {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  schedule_id!: number;

  @Column("int", { nullable: true })
  product_id!: number;

  @Column("int", { nullable: true })
  pond_id!: number;

  @ManyToOne(() => Fishschedules, (fishschedules) => fishschedules.fishschedulestock)
  @JoinColumn({ name: "schedule_id" })
  fishschedules!: Fishschedules;

  @ManyToOne(() => Products, (products) => products.fishschedulestock)
  @JoinColumn({ name: "product_id" })
  products!: Products;

  @ManyToOne(() => Fishpond, (fishpond) => fishpond.fishschedulestock)
  @JoinColumn({ name: "pond_id" })
  fishpond!: Fishpond;
}
