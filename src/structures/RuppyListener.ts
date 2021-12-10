import { Listener, type ListenerOptions } from 'discord-akairo';
import logger from 'lib/logger';
import type RuppyClient from './RuppyClient';

export default class RuppyListener extends Listener {
  public logger;

  public override client!: RuppyClient;

  public constructor(id: string, options: ListenerOptions) {
    super(id, options);

    this.logger = logger;
  }
}
