import logger from 'lib/logger';
import RuppyClient from 'structures/RuppyClient';
import { Bot } from './configs';

const client = new RuppyClient(Bot);

client
  .start()
  .then(() => logger.info('Login successfully~'))
  .catch((error) => logger.error('Something happened when login!', error));
