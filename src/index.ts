import logger from 'lib/logger';
import RuppyClient from './ruppy';

const client = new RuppyClient({
  ownerID: process.env.OWNER_ID,
  botToken: process.env.BOT_TOKEN,
});

client.start().catch((err: unknown) => {
  logger.error('Something happened when login!', err);
});
