import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, DataSource } from "typeorm";
import { Purchases } from "../../src/entity/Purchases";
import { User } from "../../src/entity/User";

describe("Database creation", () => {
  let AppDataSource: DataSource;
  beforeEach(async () => {
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
describe("User and Purchases Relationship", () => {
  let AppDataSource: DataSource;
  beforeAll(async () => {
    AppDataSource = new DataSource({
      type: "sqlite",
      database: "./database/database.sqlite",
      synchronize: true,
      logging: false,
      entities: [User, Purchases],
      migrations: [],
      subscribers: [],
    });
    await AppDataSource.initialize();
  });

  afterEach(async () => {
    // 用例结束清空数据，保持数据独立
    await AppDataSource.manager.query("DELETE FROM User");
  });

  it("should create a user with purchases", async () => {
    const user = new User();
    user.firstName = "jack";
    user.lastName = "chen";
    user.age = 18;
    await AppDataSource.manager.save(user);
    const u = await AppDataSource.manager.find(User);
    expect(u).toHaveLength(1);
    expect(u[0].purchases).toBe(undefined);
  });
});
