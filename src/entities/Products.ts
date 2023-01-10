import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { Productimages } from "./Productimages";
import { Categories } from "./Categories";
import { Auctions } from "./Auctions";
import { Fishpond } from "./Fishpond";
import { Fishgrow } from "./Fishgrow";
import { Fishhealth } from "./Fishhealth";
import { Fishschedules } from "./Fishschedules";

@Entity()
export class Products {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int", { nullable: true })
  cate_id!: number;

  @Column("int", { nullable: true })
  pond_id!: number;

  @Column({ type: "varchar", enum: ["species", "product"], nullable: true })
  type!: string;

  @Column("varchar", { nullable: true })
  name!: string;

  @Column("int", { nullable: true })
  price!: number;

  @Column("text", { nullable: true })
  detail!: string;

  @Column("varchar", { nullable: true })
  sku!: string;

  @Column("varchar", { nullable: true })
  farm!: string;

  @Column("varchar", { nullable: true })
  size!: string;

  @Column({ type: "varchar", enum: ["male", "female", "unknow"], nullable: true })
  gender!: string;

  @Column("varchar", { nullable: true })
  age!: string;

  @Column({ type: "text", enum: ["true", "false"], nullable: true })
  sold!: string;

  @Column("double", { nullable: true })
  rate!: number;

  @Column("varchar", { nullable: true })
  youtube!: string;

  @Column("varchar", { nullable: true })
  certificate!: string | null;

  @Column("int", { nullable: true })
  user_id!: number;

  @Column("int", { nullable: true })
  auctionOnly!: number;

  @Column("varchar", { nullable: true })
  bloodline!: string;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;

  @OneToMany(() => Productimages, (productimages) => productimages.products)
  @JoinColumn({ name: "id" })
  productimages!: Productimages[];

  @OneToMany(() => Fishgrow, (fishgrow) => fishgrow.products)
  @JoinColumn({ name: "id" })
  fishgrow!: Fishgrow[];

  @OneToMany(() => Fishhealth, (fishhealth) => fishhealth.products)
  @JoinColumn({ name: "id" })
  fishhealth!: Fishhealth[];

  @OneToMany(() => Fishschedules, (fishschedules) => fishschedules.products)
  @JoinColumn({ name: "id" })
  fishschedules!: Fishschedules[];

  @ManyToOne(() => Fishpond, (fishpond) => fishpond.products)
  @JoinColumn({ name: "pond_id" })
  fishpond!: Fishpond;

  @ManyToOne(() => Categories, (categories) => categories.products)
  @JoinColumn({ name: "cate_id" })
  categories!: Categories;

  @OneToOne(() => Auctions) //referenced is column
  @JoinColumn({ name: "id", referencedColumnName: "product_id" })
  auctions!: Auctions;
}
