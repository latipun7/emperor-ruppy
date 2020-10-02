import { Flag } from 'discord-akairo';
import { stripIndent } from 'common-tags';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message } from 'discord.js';
import type { ArgumentOptions, PrefixSupplier } from 'discord-akairo';

export default class ReputationCommand extends RuppyCommand {
  public constructor() {
    super('reputation', {
      aliases: ['rep', 'thanks', 'gratitude'],
      category: CmdCategories.Reputation,
      description: {
        content: 'Gratitude for helper with giving them reputation points.',
        usage: '<method> [...arguments]',
        examples: [
          'leaderboard',
          'leaderboard #general',
          'profile',
          'profile @user',
        ],
      },
    });
  }

  public *args(): IterableIterator<ArgumentOptions | Flag> {
    const method = yield {
      type: [
        ['reputation-leaderboard', 'leaderboard', 'lb'],
        ['reputation-profile', 'profile'],
      ],
      otherwise: (message: Message) => {
        const prefix = (this.handler.prefix as PrefixSupplier)(message);
        return stripIndent`
          Can't process your request.
          Check \`${prefix}help reputation\` for more information.
        `;
      },
    };

    return Flag.continue((method as unknown) as string);
  }
}
