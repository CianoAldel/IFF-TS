import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Fishpond } from "./Fishpond";
import { Products } from "./Products";
import { Schedulecount } from "./Schedulecount";
import { Fishschedulestock } from "./Fishschedulestock";

// enum Type {
//   "species",
//   "product",
// }

@Entity("fish_schedule")
export class Fishschedules {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  user_id!: number | null;

  @Column("int", { nullable: true })
  event_status!: string;

  @Column("datetime", { nullable: true })
  date_start!: Date;

  @Column("datetime", { nullable: true })
  date_schedules!: Date;

  @Column("varchar", { nullable: true })
  status!: string;

  @Column("varchar", { nullable: true })
  manage_status!: string;

  @Column("datetime", { nullable: true })
  repeat_date!: Date;

  @Column("int", { nullable: true })
  priority!: number;

  @Column("boolean", { nullable: true })
  notification_status!: Boolean;

  @Column("varchar", { nullable: true })
  note!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @OneToMany(() => Schedulecount, (schedulecount) => schedulecount.fishschedules)
  @JoinColumn({ name: "id" })
  schedulecount!: Schedulecount[];

  @OneToMany(() => Fishschedulestock, (fishschedulestock) => fishschedulestock.fishschedules)
  @JoinColumn({ name: "id" })
  fishschedulestock!: Fishschedulestock[];
}
