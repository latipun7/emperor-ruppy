import 'reflect-metadata';
import { createConnection } from 'typeorm';
import Guild from 'entities/Guild';
import Reputation from 'entities/Reputation';
import User from 'entities/User';
import ReactionRole from 'entities/ReactionRole';
import { Infra } from './configs';

export default async function connectDB() {
  return createConnection({
    type: 'postgres',
    url: Infra.dbURI,
    synchronize: true,
    logging: ['error', 'warn'],
    logger: 'advanced-console',
    entities: [Guild, Reputation, User, ReactionRole],
  });
}
