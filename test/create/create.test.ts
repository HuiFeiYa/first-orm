import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, DataSource } from "typeorm";
import { User } from "../../src/entity/User";

describe("Database creation", () => {
  let AppDataSource: DataSource;
  beforeAll(async () => {
    AppDataSource = new DataSource({
      type: "sqlite",
      database: "./database/database.sqlite",
      synchronize: true,
      logging: false,
      entities: [User],
      migrations: [],
      subscribers: [],
    });
    await AppDataSource.initialize();
  });
  test("create table", async () => {
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await AppDataSource.manager.save(user);
    const columns = await AppDataSource.manager.connection.getMetadata(User)
      .columns;
    console.log(columns);
  });
});
