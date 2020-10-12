import { Flag } from 'discord-akairo';
import { stripIndent } from 'common-tags';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message } from 'discord.js';
import type { ArgumentOptions } from 'discord-akairo';

export default class ReputationCommand extends RuppyCommand {
  public constructor() {
    super('reputation', {
      aliases: ['rep', 'thanks', 'gratitude'],
      category: CmdCategories.Reputation,
      channel: 'guild',
      ratelimit: 2,
      description: {
        content: stripIndent`
          Gratitude for helper with giving them reputation points.

          Available methods:
          • \`<leaderboard | lb> [channel]\`
          • \`<profile> [user]\`
        `,
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

  public *args(): Generator<ArgumentOptions> {
    const method = yield {
      type: [
        ['reputation-leaderboard', 'leaderboard', 'lb'],
        ['reputation-profile', 'profile'],
      ],
      otherwise: async (message: Message) => {
        const prefix = await this.getPrefix(message);

        return stripIndent`
          Can't process your request.
          Check \`${prefix}help reputation\` for more information.
        `;
      },
    };

    return Flag.continue(method as string);
  }
}
