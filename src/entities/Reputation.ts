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

  @Column({ nullable: false })
  userID!: string;

  @Column({ length: 25 })
  channelID!: string;

  @ManyToOne('User', 'reputations', { eager: true })
  @JoinColumn({ name: 'userID' })
  user!: User;
}
