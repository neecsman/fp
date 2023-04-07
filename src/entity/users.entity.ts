import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Orders } from "./";

@Entity()
export default class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstname: string;

  @Column()
  middlename: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({ default: false })
  confirm: boolean;

  @Column({ name: "confirm_link" })
  confirmLink: string;

  @OneToMany(() => Orders, (orders) => orders.userId)
  orderId: Orders[];
}
