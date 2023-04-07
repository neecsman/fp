import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Tokens {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  refreshToken: string;
}
