import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Purchases } from "./Purchases";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
  /**
   * 外键
   * 参数1:返回与当前实体相关联的目标实体
   * 参数2：用于返回目标实体中与当前实体相关联的属性。
   * 业务含义：一个用户对应可以有多条消费记录
   */
  @OneToMany(() => Purchases, (purchases) => purchases.user)
  purchases: Purchases[];
}
