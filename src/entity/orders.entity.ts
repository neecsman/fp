import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
} from "typeorm";

import { Users } from "./";

@Entity()
export default class Orders {
  @PrimaryColumn()
  id: number;

  @BeforeInsert()
  async getNextOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const millis = now.getMilliseconds();
    this.id =
      Number(`${year - 2000}${month}${day}`) +
      hours +
      minutes +
      seconds +
      millis;
  }

  @Column()
  adress_from: string;

  @Column()
  adress_where: string;

  @Column()
  customer_firstname: string;

  @Column()
  customer_lastname: string;

  @Column()
  customer_middlename: string;

  @Column()
  customer_phone: string;

  @Column()
  email: string;

  @Column()
  how_delivery: string;

  @Column()
  name_from: string;

  @Column()
  name_where: string;

  @Column()
  object: string;

  @Column()
  object_price: string;

  @Column()
  payments_adress: string;

  @Column()
  payments_method: string;

  @Column()
  phone_from: string;

  @Column()
  phone_where: string;

  @Column()
  size: string;

  @Column()
  taking_amount: number;

  @Column()
  time_delivery: string;

  @Column()
  total_weight: number;

  @CreateDateColumn()
  created_datetime: Date;

  @Column({ nullable: true })
  note_from: string;

  @Column({ nullable: true })
  note_where: string;

  @Column({ nullable: true })
  start_time: string;

  @Column({ nullable: true })
  end_time: string;

  @Column("jsonb", { nullable: true })
  dostavista_order_id: string;

  @Column({ default: "new" })
  dostavista_order_status: string;

  @Column({ default: "not paid" })
  payment_status: string;

  @ManyToOne(() => Users, (users) => users.orderId)
  @JoinColumn({ name: "user_id" })
  userId: string;
}
