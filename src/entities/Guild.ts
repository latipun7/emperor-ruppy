import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import type ReactionRole from './ReactionRole';
import type User from './User';

@Entity()
export default class Guild extends BaseEntity {
  @PrimaryColumn({ length: 25, unique: true, nullable: false })
  guildID!: string;

  @Column({ length: 15 })
  prefix!: string;

  @Column('varchar', { length: 25, array: true })
  adminRoles!: string[];

  @Column('varchar', { length: 25, array: true })
  modRoles!: string[];

  @OneToMany('User', 'guild')
  users!: Promise<User[]>;

  @OneToMany('ReactionRole', 'guild')
  reactionRoles!: Promise<ReactionRole[]>;
}
