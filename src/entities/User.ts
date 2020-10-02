import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type Guild from './Guild';
import type Reputation from './Reputation';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 25 })
  userID!: string;

  @Column({ nullable: true })
  guildID!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('Guild', 'users')
  @JoinColumn({ name: 'guildID', referencedColumnName: 'guildID' })
  guild!: Guild;

  @OneToMany('Reputation', 'user')
  reputations!: Reputation;
}
