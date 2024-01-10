import { DataSource } from "typeorm";
import { Purchases } from "../../src/entity/Purchases";
import { User } from "../../src/entity/User";

describe("User and Purchases Relationship", () => {
  let AppDataSource: DataSource;
  beforeAll(async () => {
    AppDataSource = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      synchronize: true,
      logging: true,
      entities: [User, Purchases],
    });
    await AppDataSource.initialize();
  });

  afterEach(async () => {
    // 用例结束清空数据，保持数据独立
    // await AppDataSource.manager.query("DELETE FROM User");
  });

  it("should create a user with purchases", async () => {
    const user = new User();
    user.firstName = "jack";
    user.lastName = "chen";
    user.age = 18;
    /** 创建 user */
    await AppDataSource.manager.save(user);
    const u = await AppDataSource.manager.find(User);
    expect(u).toHaveLength(1);
    expect(u[0].purchases).toBe(undefined);
    /** 创建 purchases */

    const purchase = new Purchases();
    purchase.user = user;
    purchase.amount = 2;
    await AppDataSource.manager.save(purchase);
    const savedUser = await AppDataSource.manager.findOne(User, {
      where: {
        id: user.id,
      },
      relations: ["purchases"],
    });
    const p = savedUser.purchases.map((item) => ({
      id: item.id,
      amount: item.amount,
    }));
    expect(p).toEqual([{ id: purchase.id, amount: purchase.amount }]);
  });
  it("join", async () => {
    // 使用 find 似乎智能查询关联表的所有字段
    await AppDataSource.manager.find(Purchases, {
      join: {
        alias: "purchase",
        leftJoinAndSelect: {
          user: "purchase.user",
        },
      },
      // 仅仅能筛选 Purchases 表中的字段
      select: ["id"],
    });

    // 使用 createQueryBuilder 筛选两张表部分字段
    const purchases = await AppDataSource.manager
      .createQueryBuilder()
      .select("purchase.id", "id")
      .addSelect("purchase.amount", "amount")
      .addSelect("user.firstName", "firstName")
      .from(Purchases, "purchase")
      .leftJoin(User, "user")
      .getRawMany();

    console.log(purchases);
  });
});
