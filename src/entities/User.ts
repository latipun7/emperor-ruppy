import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @ManyToOne('Guild', 'users')
  @JoinColumn({ name: 'guildID', referencedColumnName: 'guildID' })
  guild!: Guild;

  @OneToMany('Reputation', 'user')
  reputations!: Reputation;
}
