import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Sessions {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("datetime", { nullable: true })
  expires!: string;

  @Column("varchar", { nullable: true })
  session_token!: string;

  @Column("varchar", { nullable: true })
  user_id!: string;

  @Column("datetime", { nullable: true })
  createdAt!: string;

  @Column("datetime", { nullable: true })
  updatedAt!: string;
}
