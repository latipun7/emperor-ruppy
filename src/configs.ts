import type { PresenceData, Snowflake } from 'discord.js';
import { Admin } from './constants';

export const RuppyPresence: PresenceData = {
  activity: { name: '👨‍💻 Developing 🤖', type: 'PLAYING' },
};

export const Bot = {
  owners: [Admin.LATIPUN] as Snowflake[],
  token: process.env.DISCORD__BOT_TOKEN,
  defaultPrefix: '$',
};

export const Infra = {
  dbURI: process.env.DB_URI,
};
