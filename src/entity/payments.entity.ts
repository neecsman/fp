import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export default class PaymentsHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  amount: string;

  @Column()
  status: string;

  @CreateDateColumn()
  date: Date;
}
