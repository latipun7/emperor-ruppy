import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type ReactionRole from './ReactionRole';
import type User from './User';

@Entity()
export default class Guild extends BaseEntity {
  @PrimaryColumn({ length: 25, unique: true })
  guildID!: string;

  @Column({ length: 15, nullable: true })
  prefix!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany('User', 'guild')
  users!: Promise<User[]>;

  @OneToMany('ReactionRole', 'guild')
  reactionRoles!: Promise<ReactionRole[]>;
}
