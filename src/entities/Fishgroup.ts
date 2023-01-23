import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Products } from "./Products";
import { Fishschedulestock } from "./Fishschedulestock";

@Entity("fish_group")
export class Fishgroup {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { nullable: true })
  group_name!: string;

  @Column("varchar", { nullable: true })
  type!: string;

  @Column("varchar", { nullable: true })
  filename!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @OneToMany(() => Products, (products) => products.fishgroup)
  @JoinColumn({ name: "id" })
  products!: Products[];

  @OneToMany(() => Fishschedulestock, (fishschedulestock) => fishschedulestock.fishgroup)
  @JoinColumn({ name: "id" })
  fishschedulestock!: Fishschedulestock[];
}
