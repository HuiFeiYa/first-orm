import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../../src/entity/User";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize().then(async function () {
  console.log(AppDataSource);
});
