import "reflect-metadata";
import {
  DataSource,
  createConnection,
  MoreThanOrEqual,
  LessThanOrEqual,
  And,
  Between,
  LessThan,
  Not,
  getRepository,
} from "typeorm";
import { User } from "../../src/entity/User";
import { Purchases } from "../../src/entity/Purchases";
/**
 * find 完整示例
 * userRepository.find({
    select: ["firstName", "lastName"],
    relations: ["profile", "photos", "videos"],
    where: {
        firstName: "Timber",
        lastName: "Saw"
    },
    order: {
        name: "ASC",
        id: "DESC"
    },
    skip: 5,
    take: 10,
    cache: true
});
 */

/**
 * 进阶选项
 * Not、LessThan、MoreThan、Like、Between、In、IsNull 等函数
 */

let connection: DataSource;
describe("ORDER BY、GROUP BY、LIMIT、 DISTINCT、AND、OR、NOT、Like", () => {
  beforeAll(async () => {
    connection = await createConnection({
      type: "better-sqlite3",
      database: ":memory:",
      // 指示是否在每次应用程序启动时自动创建数据库架构。 请注意此选项，不要在生产环境中使用它，否则将丢失所有生产数据。
      synchronize: true,
      logging: true,
      entities: [User, Purchases],
    });
    const u1 = new User();
    u1.firstName = "Alice";
    u1.lastName = "A";
    u1.age = 12;
    await connection.manager.save(u1);
    const p1 = new Purchases();
    p1.amount = 2;
    p1.user = u1;
    await connection.manager.save(p1);

    const u2 = new User();
    u2.firstName = "Bob";
    u2.lastName = "B";
    u2.age = 18;
    await connection.manager.save(u2);
    const p2 = new Purchases();
    p2.amount = 1;
    p2.user = u1; // todo save

    const u3 = new User();
    u3.firstName = "Clan";
    u3.lastName = "C";
    u3.age = 15;
    await connection.manager.save(u3);
    const p3 = new Purchases();
    p3.amount = 5;
    p3.user = u1;
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
  test("OR", async () => {
    const result = await connection.manager.find(User, {
      where: [
        {
          age: LessThan(15),
        },
        {
          firstName: "Bob",
        },
      ],
    });
    expect(result.map((item) => item.id)).toEqual([1, 2]);
  });

  test("Not", async () => {
    const result = await connection.manager.find(User, {
      where: [
        {
          age: Not(15),
        },
      ],
    });
    expect(result.map((item) => item.id)).toEqual([1, 2]);
  });

  test("ORDER BY age ASC", async () => {
    const userRepository = getRepository(User);
    const result = await userRepository.find({
      order: {
        age: "ASC",
      },
    });
    expect(result.map((item) => item.id)).toEqual([1, 3, 2]);
  });

  test("ORDER BY age DESC", async () => {
    const userRepository = getRepository(User);
    const result = await userRepository.find({
      order: {
        age: "DESC",
      },
    });
    expect(result.map((item) => item.id)).toEqual([2, 3, 1]);
  });

  test("select field", async () => {
    const userRepository = getRepository(User);
    const result = await userRepository.find({
      select: ["id", "age"],
      order: {
        age: "ASC",
      },
    });
    expect(result).toEqual([
      { id: 1, age: 12 },
      { id: 3, age: 15 },
      { id: 2, age: 18 },
    ]);
  });

  test("max age", async () => {
    const userRepository = getRepository(User);
    const result = await userRepository.find({
      select: ["id", "age"],
      order: {
        age: "desc",
      },
      take: 1,
    });
    expect(result).toEqual([{ id: 2, age: 18 }]);
  });

  test("user update auto sync to purchase", async () => {
    const userRepository = getRepository(User);
    const u1 = await userRepository.findOne({
      where: { id: 1 },
      relations: ["purchases"],
    });
    const newName = "changed name";
    u1.firstName = newName;
    await userRepository.save(u1);

    const purchaseRep = getRepository(Purchases);
    // SELECT "Purchases"."id" AS "Purchases_id", "Purchases"."amount" AS "Purchases_amount", 
    // "Purchases"."user_id" AS "Purchases_user_id", 
    // "Purchases__Purchases_user"."id" AS "Purchases__Purchases_user_id", 
    // "Purchases__Purchases_user"."firstName" AS "Purchases__Purchases_user_firstName", 
    // "Purchases__Purchases_user"."lastName" AS "Purchases__Purchases_user_lastName", 
    // "Purchases__Purchases_user"."age" AS "Purchases__Purchases_user_age" FROM "purchases" 
    // "Purchases" LEFT JOIN "user" "Purchases__Purchases_user" ON "Purchases__Purchases_user"."id" = "Purchases"."user_id" WHERE(("Purchases"."id" = 1) ) AND("Purchases"."id" IN(1))
    const p1 = await purchaseRep.findOne({
      where: { id: 1 },
      relations: ["user"],
    });
    expect(p1.user.firstName).toBe(newName);
  });
});
