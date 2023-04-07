import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users, Tokens, Orders, PaymentsHistory } from "./entity";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  // username: "Neecsman",
  // password: "Fastpoints_01",
  username: "neecsman",
  password: "neecsman_01",
  database: "fastpoints",
  synchronize: true,
  logging: false,
  entities: [Users, Tokens, Orders, PaymentsHistory],
  subscribers: [],
  migrations: [],
});
