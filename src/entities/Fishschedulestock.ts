import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Products } from "./Products";
import { SchedulesCategory } from "./Schedulescategory";
import { Fishpond } from "./Fishpond";
import { Fishgroup } from "./Fishgroup";
import { FishschedulesRepeat } from "./Fishschedulesrepeat";

@Entity("fishschedules_stock")
export class Fishschedulestock {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  fish_repeat_id!: number;

  @Column("int", { nullable: true })
  product_id!: number;

  @Column("int", { nullable: true })
  fishgroup_id!: number;

  @Column("int", { nullable: true })
  pond_id!: number;

  @ManyToOne(() => FishschedulesRepeat, (fishschedulesrepeat) => fishschedulesrepeat.fishschedulestock)
  @JoinColumn({ name: "fish_repeat_id" })
  fishschedulesrepeat!: FishschedulesRepeat;

  @ManyToOne(() => Products, (products) => products.fishschedulestock)
  @JoinColumn({ name: "product_id" })
  products!: Products;

  @ManyToOne(() => Fishpond, (fishpond) => fishpond.fishschedulestock)
  @JoinColumn({ name: "pond_id" })
  fishpond!: Fishpond;

  @ManyToOne(() => Fishgroup, (fishgroup) => fishgroup.fishschedulestock)
  @JoinColumn({ name: "fishgroup_id" })
  fishgroup!: Fishgroup;
}
