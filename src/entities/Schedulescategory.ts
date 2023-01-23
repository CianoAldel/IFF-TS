import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Fishpond } from "./Fishpond";
import { Products } from "./Products";
import { Fishschedulestock } from "./Fishschedulestock";
import { FishschedulesRepeat } from "./Fishschedulesrepeat";
import { Fishscheduleslog } from "./Fishscheduleslog";

// enum Type {
//   "species",
//   "product",
// }

@Entity("schedules_category")
export class SchedulesCategory {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  event_status!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @OneToMany(() => FishschedulesRepeat, (fishschedulesRepeat) => fishschedulesRepeat.schedulescategory)
  @JoinColumn({ name: "id" })
  fishschedulesrepeat!: FishschedulesRepeat[];
}
