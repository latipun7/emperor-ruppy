import { Command } from 'discord-akairo';
import logger from 'lib/logger';
import type { CommandOptions } from 'discord-akairo';
import type RuppyClient from './RuppyClient';

export const enum CmdCategories {
  Admin = 'admin',
  Develop = 'development',
  Util = 'utilities',
}

interface RuppyCommandOptions extends CommandOptions {
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
    const opt = options;

    if (opt.aliases) {
      if (!opt.aliases.includes(id)) {
        opt.aliases.unshift(id);
      }
    } else {
      opt.aliases = [id];
    }

    super(id, options);

    this.logger = logger;
  }
}
