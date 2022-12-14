import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Sequelizemeta {
  @PrimaryGeneratedColumn("identity")
  name!: string;
}
