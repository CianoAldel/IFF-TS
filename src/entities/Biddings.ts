import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Auctions } from "./Auctions";
import { Users } from "./Users";

@Entity()
export class Biddings {
  @PrimaryGeneratedColumn("increment")
  id!: string;

  @Column("char", { nullable: true })
  auction_id!: string;

  @Column("int", { nullable: true })
  user_id!: number;

  @Column("int", { nullable: true })
  bidding!: number;

  @Column("varchar", { nullable: true })
  createdAt!: Date;

  @Column("varchar", { nullable: true })
  updatedAt!: Date;

  @ManyToOne(() => Auctions, (auctions) => auctions.biddings)
  @JoinColumn({ name: "auction_id" })
  auctions!: Auctions;

  @ManyToOne(() => Users, (users) => users.biddings)
  @JoinColumn({ name: "user_id" })
  user!: Users;
}
