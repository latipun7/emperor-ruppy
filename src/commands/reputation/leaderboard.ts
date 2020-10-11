import { MessageEmbed } from 'discord.js';
import { stripIndent } from 'common-tags';
import Reputation from 'entities/Reputation';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message, TextChannel } from 'discord.js';

interface CmdArgs {
  channel?: TextChannel;
}

// eslint-disable-next-line camelcase
type RawData = { rep_userID: string; count: string }[];

export default class ReputationLeaderboardCommand extends RuppyCommand {
  public constructor() {
    super('reputation-leaderboard', {
      isSubCmd: true,
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
    if (!message.guild) return message.util?.send('guild / server only');

    try {
      const embed = new MessageEmbed().setColor('#FF8809');
      const rankEmojis = ['🥇', '🥈', '🥉'];
      const gid = message.guild?.id;

      if (channel) {
        const cid = channel.id;
        const rawData: RawData = await Reputation.createQueryBuilder('rep')
          .select(['rep.userID', 'COUNT(*)'])
          .where('rep.guildID = :gid AND rep.channelID = :cid', {
            gid,
            cid,
          })
          .groupBy('rep.userID')
          .orderBy('COUNT(*)', 'DESC')
          .limit(10)
          .cache(`${cid}_channel_rep`)
          .getRawMany();

        const data = rawData.map((datum) => ({
          id: datum.rep_userID,
          count: parseInt(datum.count, 10),
        }));

        embed
          .setTitle(
            stripIndent`Top 10 Most Reputable Person in #${channel.name}`
          )
          .setDescription(
            data
              .map(
                (datum, index) =>
                  `${rankEmojis[index] || '🎗️'} **<@${datum.id}>** with **${
                    datum.count
                  }** points.`
              )
              .join('\n\n')
          );

        return await message.util?.send(embed);
      }

      const rawData: RawData = await Reputation.createQueryBuilder('rep')
        .select(['rep.userID', 'COUNT(*)'])
        .where('rep.guildID = :id', { id: message.guild?.id })
        .groupBy('rep.userID')
        .orderBy('COUNT(*)', 'DESC')
        .limit(10)
        .cache(`${gid}_guild_rep`)
        .getRawMany();

      const data = rawData.map((datum) => ({
        id: datum.rep_userID,
        count: parseInt(datum.count, 10),
      }));

      embed
        .setTitle(
          stripIndent`Top 10 Most Reputable Person in ${message.guild?.name}`
        )
        .setDescription(
          data
            .map(
              (datum, index) =>
                `${rankEmojis[index] || '🎗️'} **<@${datum.id}>** with **${
                  datum.count
                }** points.`
            )
            .join('\n\n')
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
