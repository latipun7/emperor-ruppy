import { Command } from 'discord-akairo';
import logger from 'lib/logger';
import type { Message } from 'discord.js';
import type { CommandOptions, PrefixSupplier } from 'discord-akairo';
import type RuppyClient from './RuppyClient';

export const enum CmdCategories {
  Admin = 'admin',
  Develop = 'development',
  Util = 'utilities',
  Reputation = 'reputation',
}

interface RuppyCommandOptions extends CommandOptions {
  isSubCmd?: boolean;
  category: CmdCategories;
  description: {
    content: string;
    usage?: string;
    examples?: string[];
  };
}

export class RuppyCommand extends Command {
  public logger;

  public description!: {
    content: string;
    usage?: string;
    examples?: string[];
  };

  public client!: RuppyClient;

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

  public async getPrefix(message: Message) {
    let prefixes = await (this.handler.prefix as PrefixSupplier)(message);

    if (Array.isArray(prefixes)) {
      [prefixes] = prefixes;
    }

    const prefix = prefixes;

    return prefix;
  }

  static getAliases(cmd: RuppyCommand) {
    if (cmd.aliases.length > 1) {
      const alias = Array.from(cmd.aliases);

      alias.shift();
      return alias;
    }

    return undefined;
  }
}
