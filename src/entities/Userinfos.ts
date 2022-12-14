import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Userinfos {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  user_id!: number;

  @Column("varchar", { nullable: true })
  phone!: string;

  @Column("varchar", { nullable: true })
  firstName!: string;

  @Column("varchar", { nullable: true })
  lastName!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;
}
