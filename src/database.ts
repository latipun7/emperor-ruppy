import Guild from 'entities/Guild';
import ReactionRole from 'entities/ReactionRole';
import Reputation from 'entities/Reputation';
import User from 'entities/User';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Infra } from './configs';

// const MAX_INTEGER = 2147483647;

export default async function connectDB() {
  return createConnection({
    type: 'postgres',
    url: Infra.dbURI,
    synchronize: true,
    cache: false,
    logging: ['error', 'warn'],
    logger: 'advanced-console',
    entities: [Guild, Reputation, User, ReactionRole],
  });
}
