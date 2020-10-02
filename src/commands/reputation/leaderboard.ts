import { stripIndent } from 'common-tags';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message, TextChannel } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import Reputation from 'entities/Reputation';

interface CmdArgs {
  channel?: TextChannel;
}

// eslint-disable-next-line camelcase
type RawData = { rep_userID: string; count: string }[];

export default class ReputationLeaderboardCommand extends RuppyCommand {
  public constructor() {
    super('reputation-leaderboard', {
      category: CmdCategories.Reputation,
      channel: 'guild',
      description: {
        content:
          'Leaderboard of reputation, see who is the most helpful person.',
        usage: '[channel]',
        examples: ['', '#general'],
      },
      args: [
        {
          id: 'channel',
          type: 'textChannel',
          prompt: { optional: true, retry: "Can't resolve channel." },
        },
      ],
    });
  }

  public async exec(message: Message, { channel }: CmdArgs) {
    try {
      const embed = new MessageEmbed().setColor('#FF8809');

      if (channel) {
        const rawData: RawData = await Reputation.createQueryBuilder('rep')
          .select(['rep.userID', 'COUNT(*)'])
          .where('rep.channelID = :id', { id: channel.id })
          .groupBy('rep.userID')
          .orderBy('COUNT(*)', 'DESC')
          .limit(10)
          .getRawMany();

        const data = rawData.map((datum) => ({
          id: datum.rep_userID,
          count: parseInt(datum.count, 10),
        }));

        embed
          .setTitle('Top 10 Most Reputable Person')
          .setDescription(
            data
              .map(
                (datum) =>
                  `🏅 **<@${datum.id}>** with **${datum.count}** points.`
              )
              .join('\n')
          );

        return await message.util?.send(embed);
      }

      const rawData: RawData = await Reputation.createQueryBuilder('rep')
        .select(['rep.userID', 'COUNT(*)'])
        .where('rep.guildID = :id', { id: message.guild?.id })
        .groupBy('rep.userID')
        .orderBy('COUNT(*)', 'DESC')
        .limit(10)
        .getRawMany();

      const data = rawData.map((datum) => ({
        id: datum.rep_userID,
        count: parseInt(datum.count, 10),
      }));

      embed
        .setTitle('Top 10 Most Reputable Person')
        .setDescription(
          data
            .map(
              (datum) => `🏅 **<@${datum.id}>** with **${datum.count}** points.`
            )
            .join('\n')
        );

      return await message.util?.send(embed);
    } catch (error) {
      this.logger.error('Reputation Leaderboard Command error:', error);

      return await message.util?.send(
        stripIndent`
          Sorry, something went wrong. Please tell developer with this info:
          \`\`\`js
          ${new Date().toISOString()}
          \`\`\`
        `
      );
    }
  }
}
