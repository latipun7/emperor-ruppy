import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import { resolve } from 'path';
import { RuppyPresence } from 'src/configs';
import type { Message } from 'discord.js';
import type { ClientConfig } from 'typings/ruppy';

export default class RuppyClient extends AkairoClient {
  public constructor(private config: ClientConfig) {
    super(
      { ownerID: config.owners },
      {
        disableMentions: 'everyone',
        messageCacheMaxSize: 19,
        messageCacheLifetime: 15 * 60,
        messageSweepInterval: 1 * 60,
        presence: RuppyPresence,
      }
    );
  }

  public commandHandler = new CommandHandler(this, {
    directory: resolve(__dirname, '..', 'commands'),
    allowMention: true,
    aliasReplacement: /-/g,
    handleEdits: true,
    commandUtil: true,
    prefix: async (message: Message) => {
      if (message.guild) {
        // TODO: add guild specific settings
        return this.config.defaultPrefix;
      }
      return this.config.defaultPrefix;
    },
  });

  public inhibitorHandler = new InhibitorHandler(this, {
    directory: resolve(__dirname, '..', 'inhibitors'),
  });

  public listenerHandler = new ListenerHandler(this, {
    directory: resolve(__dirname, '..', 'listeners'),
  });

  public async start() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.inhibitorHandler.loadAll();

    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
    });
    this.listenerHandler.loadAll();

    this.commandHandler.loadAll();

    await this.login(this.config.token);
  }
}
