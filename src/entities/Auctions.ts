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

enum Status {
  "true",
  "false",
}

@Entity()
export class Auctions {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("int", { nullable: true })
  product_id!: number;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @Column("int", { nullable: true })
  startPrice!: number;

  @Column("datetime", { nullable: true })
  startDate!: string;

  @Column("datetime", { nullable: true })
  endDate!: string;

  @Column("int", { nullable: true })
  biddingTime!: number;

  @Column("int", { nullable: true })
  minBid!: number;

  @Column("text", { nullable: true })
  status!: string;

  @Column("datetime", { nullable: true })
  endOfAuction!: string;

  @OneToMany(() => Biddings, (biddings) => biddings.auctions)
  biddings!: Biddings[];

  @OneToMany(() => Biddings, (biddings) => biddings.user)
  user!: Users[];

  @OneToOne(() => Products)
  @JoinColumn({ name: "product_id" }) //
  products!: Products;
}
