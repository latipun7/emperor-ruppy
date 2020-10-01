import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type User from './User';

@Entity()
export default class Reputation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userID!: string;

  @Column({ length: 25 })
  channelID!: string;

  @ManyToOne('User', 'reputations')
  @JoinColumn({ name: 'userID' })
  user!: User;
}
