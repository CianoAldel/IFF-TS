import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Products } from "./Products";
import { SchedulesCategory } from "./Schedulescategory";
import { Fishschedulestock } from "./Fishschedulestock";

@Entity("fish_pond")
export class Fishpond {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  user_id!: number;

  @Column("varchar", { nullable: true })
  fish_pond_id!: string;

  @Column("int", { nullable: true })
  fish_pond_name!: string;

  @Column("varchar", { nullable: true })
  note!: string;

  @Column("varchar", { nullable: true })
  status!: string;

  @Column("datetime", { nullable: true })
  use_pond_date!: Date;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @OneToMany(() => Fishschedulestock, (fishschedulestocks) => fishschedulestocks.fishpond)
  @JoinColumn({ name: "id" })
  fishschedulestock!: Fishschedulestock[];

  @OneToMany(() => Products, (products) => products.fishpond)
  @JoinColumn({ name: "id" })
  products!: Products[];
}
