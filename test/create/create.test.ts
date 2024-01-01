import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, DataSource } from "typeorm";
import { Purchases } from "../../src/entity/Purchases";
import { User } from "./User";

describe("Database creation", () => {
  let AppDataSource: DataSource;
  beforeEach(async () => {
    AppDataSource = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      synchronize: true,
      logging: true,
      entities: [User],
    });
    await AppDataSource.initialize();
  });
  afterEach(async () => {
    // 执行 sql
    await AppDataSource.manager.query("DELETE FROM User");
  });

  test("create table", async () => {
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await AppDataSource.manager.save(user);
    const columns = await AppDataSource.manager.connection.getMetadata(User)
      .columns;
    const databaseNames = columns.map((item) => item.databaseName);
    expect(databaseNames).toEqual(["id", "firstName", "lastName", "age"]);
  });
});
