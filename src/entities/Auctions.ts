import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Products } from "./Products";
import { Biddings } from "./Biddings";
import { Users } from "./Users";

//   enum Channel {
//     "topup",
//     "event",
//     "game",
//     "reward",
//     "privilege",
//     "other",
//     "product",
//     "in-App Purchase",
//     "airtime",
//   }

enum Status {
  "true",
  "false",
}

//   enum Type {
//     'use', 'add'
//   }

@Entity()
export class Auctions {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column("int", { nullable: true })
  product_id!: number;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @Column("varchar", { nullable: true })
  startPrice!: string;

  @Column("datetime", { nullable: true })
  startDate!: string;

  @Column("datetime", { nullable: true })
  endDate!: string;

  @Column("int", { nullable: true })
  biddingTime!: number;

  @Column("int", { nullable: true })
  minBid!: Status;

  @Column("text", { nullable: true })
  status!: string;

  @OneToMany(() => Biddings, (biddings) => biddings.auctions)
  biddings!: Biddings[];

  @OneToMany(() => Biddings, (biddings) => biddings.user)
  user!: Users[];

  @OneToOne(() => Products)
  @JoinColumn({ name: "product_id" }) //
  products!: Products;
}
