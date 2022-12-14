import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Users } from "./Users";

@Entity()
export class Accounts {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { nullable: true })
  type!: string;

  @Column("varchar", { nullable: true })
  provider!: string;

  @Column("varchar", { nullable: true })
  provider_account_id!: string;

  @Column("varchar", { nullable: true })
  refresh_token!: string;

  @Column("varchar", { nullable: true })
  access_token!: string;

  @Column("int", { nullable: true })
  expires_at!: number;

  @Column("varchar", { nullable: true })
  token_type!: string;

  @Column("varchar", { nullable: true })
  scope!: string;

  @Column("varchar", { nullable: true })
  id_token!: string;

  @Column("varchar", { nullable: true })
  session_state!: string;

  @Column("varchar", { nullable: true })
  user_id!: string;

  @Column("datetime", { nullable: true })
  createdAt!: string;

  @Column("datetime", { nullable: true })
  updatedAt!: string;

  // @ManyToOne(() => Users, (user) => user.accounts, {
  //   createForeignKeyConstraints: true,
  // })
  // user!: Users;
}
