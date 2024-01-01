import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Purchases {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  /**
   * 业务含义：一条消费记录对应一个用户
   */
  @ManyToOne(() => User, (user) => user.purchases)
  @JoinColumn({ name: "user_id" })
  user: User;
}
