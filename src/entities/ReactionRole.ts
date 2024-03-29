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
import type Guild from './Guild';

@Entity()
export default class ReactionRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 25 })
  guildID!: string;

  @Column({ length: 25 })
  channelID!: string;

  @Column({ length: 25 })
  messageID!: string;

  @Column({ length: 100 })
  emoji!: string;

  @Column({ length: 25 })
  role!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne('Guild', 'reactionRoles')
  @JoinColumn({ name: 'guildID', referencedColumnName: 'guildID' })
  guild!: Guild;
}
