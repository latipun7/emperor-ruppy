import {
  Command,
  type CommandOptions,
  type PrefixSupplier,
} from 'discord-akairo';
import type { Message } from 'discord.js';
import logger from 'lib/logger';
import { Bot } from 'src/configs';
import { Emojis } from 'src/constants';
import type RuppyClient from './RuppyClient';

export const CmdCategories = {
  Admin: `${Emojis.ADMINISTRATION} admin`,
  Develop: `${Emojis.DEVELOPMENT} development`,
  Info: `${Emojis.INFORMATION} information`,
  Util: '🛠 utilities',
  Reputation: `${Emojis.REPUTATION} reputation`,
};

interface RuppyCommandOptions extends CommandOptions {
  isSubCmd?: boolean;
  description: {
    content: string;
    usage?: string;
    examples?: string[];
  };
}

export class RuppyCommand extends Command {
  public logger;

  public override aliases!: [string, ...string[]];

  public override description!: {
    content: string;
    usage?: string;
    examples?: string[];
  };

  public override client!: RuppyClient;

  public constructor(id: string, options: RuppyCommandOptions) {
    const opt = Object.create(options) as RuppyCommandOptions;

    if (!opt.isSubCmd) {
      if (opt.aliases) {
        if (!opt.aliases.includes(id)) {
          opt.aliases.unshift(id);
        }
      } else {
        opt.aliases = [id];
      }
    }

    delete opt.isSubCmd;

    super(id, opt);

    this.logger = logger;
  }

  public async getPrefix(message: Message): Promise<string> {
    const prefixes = await (this.handler.prefix as PrefixSupplier)(message);

    if (Array.isArray(prefixes)) {
      return prefixes.shift() || Bot.defaultPrefix;
    }

    return prefixes;
  }

  static getAliases(cmd: RuppyCommand): string[] | undefined {
    if (cmd.aliases.length > 1) {
      const alias = Array.from(cmd.aliases);

      alias.shift();
      return alias;
    }

    return undefined;
  }
}
