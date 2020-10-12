import type { PresenceData, Snowflake } from 'discord.js';
import { Admin } from './constants';

export const RuppyPresence: PresenceData = {
  activity: { name: '👨‍💻 Developing 🤖', type: 'PLAYING' },
};

export const Bot = {
  owners: [Admin.LATIPUN] as Snowflake[],
  token: process.env.DISCORD__BOT_TOKEN,
  defaultPrefix: process.env.PREFIX || '$',
};

export const Infra = {
  dbURI: process.env.DB_URI,
};

export const isProduction = process.env.NODE_ENV === 'production' || false;
