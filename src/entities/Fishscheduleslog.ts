import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { FishschedulesRepeat } from "./Fishschedulesrepeat";

import { SchedulesCategory } from "./Schedulescategory";

@Entity("fishschedules_log")
export class Fishscheduleslog {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  user_id!: number | null;

  @Column("int", { nullable: true })
  fish_repeat_id!: number;

  @Column("varchar", { nullable: true })
  note!: string;

  @Column("varchar", { nullable: true })
  manage_status!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => FishschedulesRepeat, (fishschedulesRepeat) => fishschedulesRepeat.fishscheduleslog)
  @JoinColumn({ name: "fish_repeat_id" })
  fishschedulesRepeat!: FishschedulesRepeat;
}
