import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type Guild from './Guild';
import type Reputation from './Reputation';

@Entity()
export default class User extends BaseEntity {
  @PrimaryColumn({ length: 25, unique: true })
  userID!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToMany('Guild', 'users')
  @JoinTable({
    joinColumn: { name: 'userID', referencedColumnName: 'userID' },
    inverseJoinColumn: { name: 'guildID', referencedColumnName: 'guildID' },
  })
  guilds!: Guild[];

  @OneToMany('Reputation', 'user')
  reputations!: Reputation;
}
