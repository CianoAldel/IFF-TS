import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Products } from "./Products";
import { Fishschedules } from "./Fishschedules";

@Entity("schedule_count")
export class Schedulecount {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  fish_schedule_id!: number;

  @ManyToOne(() => Fishschedules, (fishschedules) => fishschedules.schedulecount)
  @JoinColumn({ name: "id" })
  fishschedules!: Fishschedules;
}
