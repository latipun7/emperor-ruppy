import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type Guild from './Guild';

@Entity()
export default class ReactionRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 25, nullable: false })
  guildID!: string;

  @Column({ length: 25 })
  channelID!: string;

  @Column({ length: 25 })
  messageID!: string;

  @Column('varchar', { length: 25, array: true })
  roles!: string[];

  @ManyToOne('Guild', 'reactionRoles', { eager: true })
  @JoinColumn({ name: 'guildID', referencedColumnName: 'guildID' })
  guild!: Guild;
}
