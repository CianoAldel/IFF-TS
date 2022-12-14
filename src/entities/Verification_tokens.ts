import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

enum Bidder {
  "true",
  "false",
}

enum Role {
  "super-admin",
  "admin",
  "staff",
  "user",
}

@Entity()
export class VerificationTokenEntity {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { nullable: true })
  token!: string;

  @Column("varchar", { nullable: true })
  identifier!: string;

  @Column("datetime", { nullable: true })
  expires!: string;

  @Column("datetime", { nullable: true })
  createdAt!: string;

  @Column("datetime", { nullable: true })
  updatedAt!: string;
}
