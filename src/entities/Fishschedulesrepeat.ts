import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Fishpond } from "./Fishpond";
import { Products } from "./Products";
import { Fishschedulestock } from "./Fishschedulestock";
import { SchedulesCategory } from "./Schedulescategory";
import { Fishscheduleslog } from "./Fishscheduleslog";

@Entity("fishschedule_repeat")
export class FishschedulesRepeat {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  schedules_cate_id!: number;

  @Column("int", { nullable: true })
  user_id!: number | null;

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

  @ManyToOne(() => SchedulesCategory, (fishschedules) => fishschedules.fishschedulesrepeat)
  @JoinColumn({ name: "schedules_cate_id" })
  schedulescategory!: SchedulesCategory;

  @OneToMany(() => Fishscheduleslog, (fishschedules) => fishschedules.fishschedulesRepeat)
  @JoinColumn({ name: "id" })
  fishscheduleslog!: Fishscheduleslog[];

  @OneToMany(() => Fishschedulestock, (fishschedules) => fishschedules.fishschedulesrepeat)
  @JoinColumn({ name: "id" })
  fishschedulestock!: Fishschedulestock[];
}
