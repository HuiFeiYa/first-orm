import "reflect-metadata";
import {
  DataSource,
  createConnection,
  MoreThanOrEqual,
  LessThanOrEqual,
  And,
  Between,
} from "typeorm";
import { User } from "../create/User";

let connection: DataSource;
describe("ORDER BY、GROUP BY、LIMIT、 DISTINCT、AND、OR、NOT、Like", () => {
  beforeAll(async () => {
    connection = await createConnection({
      type: "better-sqlite3",
      database: ":memory:",
      // 指示是否在每次应用程序启动时自动创建数据库架构。 请注意此选项，不要在生产环境中使用它，否则将丢失所有生产数据。
      synchronize: true,
      logging: true,
      entities: [User],
    });
    const u1 = new User();
    u1.firstName = "Alice";
    u1.lastName = "A";
    u1.age = 12;
    await connection.manager.save(u1);

    const u2 = new User();
    u2.firstName = "Bob";
    u2.lastName = "B";
    u2.age = 18;
    await connection.manager.save(u2);

    const u3 = new User();
    u3.firstName = "Clan";
    u3.lastName = "C";
    u3.age = 15;
    await connection.manager.save(u3);
  });

  test("AND", async () => {
    const result = await connection.manager.find(User, {
      where: [
        {
          age: Between(15, 18),
        },
      ],
    });
    expect(result.map((item) => item.id)).toEqual([2, 3]);
  });
});
