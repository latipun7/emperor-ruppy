import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type User from './User';

@Entity()
export default class Reputation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userID!: string;

  @Column({ length: 25 })
  guildID!: string;

  @Column({ length: 25 })
  channelID!: string;

  @Column({ length: 25 })
  messageID!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('User', 'reputations')
  @JoinColumn({ name: 'userID', referencedColumnName: 'userID' })
  user!: User;
}
