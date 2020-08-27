import { AkairoClient } from 'discord-akairo';
import type { ClientConfig } from 'typings/ruppy';

export default class RuppyClient extends AkairoClient {
  constructor(private config: ClientConfig) {
    super({ ownerID: config.ownerID }, { disableMentions: 'everyone' });
  }

  start() {
    return this.login(this.config.botToken);
  }
}
