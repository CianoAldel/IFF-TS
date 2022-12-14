import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Services {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { nullable: true })
  title!: string;

  @Column("varchar", { nullable: true })
  content!: string;

  @Column("varchar", { nullable: true })
  cover!: string | undefined;

  @Column("int", { nullable: true })
  pageview!: number;

  @Column("datetime", { nullable: true })
  createdAt!: Date;

  @Column("datetime", { nullable: true })
  updatedAt!: Date;
}
