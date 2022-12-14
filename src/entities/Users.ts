import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Userinfos } from "./Userinfos";
import { Addresses } from "./Addresses";
import { Sessions } from "./Sessions";
import { Accounts } from "./Accounts";
import { Biddings } from "./Biddings";

enum Bidder {
  "true",
  "false",
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { nullable: true })
  username!: string;

  @Column("varchar", { nullable: true })
  displayName!: string;

  @Column("varchar", { nullable: true })
  name!: string;

  @Column("varchar", { nullable: true })
  password!: string;

  @Column({ type: "varchar", enum: ["super-admin", "admin", "staff", "user"], nullable: true })
  role!: string;

  @Column("datetime") //defualt : new Date()
  createdAt!: Date;

  @Column("datetime") //defualt : new Date()
  updatedAt!: Date;

  @Column("varchar", { nullable: true })
  email!: string;

  @Column("datetime", { nullable: true })
  email_verified!: string;

  @Column("varchar", { nullable: true })
  image!: string;

  @Column({ type: "varchar", enum: ["true", "false"], nullable: true })
  bidder!: string;

  @OneToMany(() => Addresses, (addresses) => addresses.user_id)
  addresses!: Addresses[];

  @OneToMany(() => Sessions, (session) => session.user_id)
  sessions!: Sessions[];

  @OneToMany(() => Accounts, (account) => account.user_id)
  accounts!: Accounts[];

  @OneToOne(() => Userinfos, (userinfos) => userinfos.user_id)
  userinfos!: Userinfos;

  @OneToMany(() => Biddings, (biddings) => biddings.user)
  biddings!: Biddings[];
}
