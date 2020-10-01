import logger from 'lib/logger';
import RuppyClient from 'structures/RuppyClient';
import { Bot } from './configs';
import connectDB from './database';

connectDB()
  .then(() => {
    logger.info('Database connected~');

    const client = new RuppyClient(Bot);

    client
      .start()
      .then(() => logger.info('Login successfully~'))
      .catch((error) => {
        logger.error('Something happened when login!', error);
        process.exit(1);
      });
  })
  .catch((error) => {
    logger.error('Database error!', error);
    process.exit(1);
  });
