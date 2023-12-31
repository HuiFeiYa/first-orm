import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "购买记录" })
export class Purchases {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  date: Date;

  /**
   * 业务含义：一条消费记录对应一个用户
   */
  @ManyToOne(() => User, (user) => user.purchases)
  user: User;
}
