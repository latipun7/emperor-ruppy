import { stripIndent } from 'common-tags';
import {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} from 'discord-akairo';
import { Intents, type Message } from 'discord.js';
import Guild from 'entities/Guild';
import { resolve } from 'path';
import { RuppyPresence } from 'src/configs';
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
        partials: ['MESSAGE', 'REACTION', 'USER', 'CHANNEL'],
        ws: { intents: Intents.NON_PRIVILEGED },
      }
    );
  }

  public commandHandler = new CommandHandler(this, {
    directory: resolve(__dirname, '..', 'commands'),
    allowMention: true,
    aliasReplacement: /-/g,
    handleEdits: true,
    commandUtil: true,
    defaultCooldown: 15 * 1000,
    argumentDefaults: {
      prompt: {
        time: 55 * 1000,
        retries: 3,
        cancel: 'Command has been cancelled.',
        timeout: ({ author }: Message) =>
          stripIndent`
            ${author}, time ran out.
            Command has been canceled.
          `,
        ended: ({ author }: Message) =>
          stripIndent`
            ${author}, exceeding retries max count.
            Command has been canceled.
          `,
        modifyStart: ({ author }, text) =>
          stripIndent`
            ${author}, ${text}

            _Type \`cancel\` to cancel this command._
          `,
        modifyRetry: ({ author }, text, data) =>
          stripIndent`
            **${text}**
            ${author}, please try again.

            _Number of retries: **${data.retries - 1}/3**._
            _Type \`cancel\` to cancel this command._
          `,
      },
    },
    prefix: async (message: Message) => {
      if (message.guild) {
        const guild = await Guild.findOne(message.guild.id);

        return guild?.prefix || this.config.defaultPrefix;
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
