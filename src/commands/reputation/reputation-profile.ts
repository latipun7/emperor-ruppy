import { MessageEmbed } from 'discord.js';
import { stripIndent } from 'common-tags';
import Reputation from 'entities/Reputation';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message, GuildMember } from 'discord.js';

interface CmdArgs {
  member?: GuildMember;
}

type UserRawData = { repUserID: string; count: string } | undefined;
type ChannelRawData = { repChannelID: string; count: string }[];

export default class ReputationProfileCommand extends RuppyCommand {
  public constructor() {
    super('reputation-profile', {
      isSubCmd: true,
      category: CmdCategories.Reputation,
      channel: 'guild',
      ratelimit: 1,
      description: {
        content: 'See reputation breakdown of the guild member.',
        usage: '[member]',
        examples: ['', '@otherMember'],
      },
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: { optional: true, retry: "Can't resolve member." },
        },
      ],
    });
  }

  public async exec(message: Message, { member }: CmdArgs) {
    if (!message.guild || !message.member)
      return message.util?.send('guild / server only');

    try {
      const embed = new MessageEmbed().setColor('#FF8809');
      const gid = message.guild.id;

      const userRawData: UserRawData = await Reputation.createQueryBuilder(
        'rep'
      )
        .select(['rep.userID AS "repUserID"', 'COUNT(*)'])
        .where('rep.guildID = :id AND rep.userID = :user', {
          id: gid,
          user: member?.id || message.member.id,
        })
        .groupBy('rep.userID')
        .orderBy('COUNT(*)', 'DESC')
        .limit(5)
        .cache(`${gid}_${member?.id || message.member.id}_guild_member_rep`)
        .getRawOne();

      const channelRawData: ChannelRawData =
        await Reputation.createQueryBuilder('rep')
          .select(['rep.channelID AS "repChannelID"', 'COUNT(*)'])
          .where('rep.guildID = :id AND rep.userID = :user', {
            id: gid,
            user: member?.id || message.member.id,
          })
          .groupBy('rep.channelID')
          .orderBy('COUNT(*)', 'DESC')
          .cache(`${gid}_${member?.id || message.member.id}_channel_member_rep`)
          .getRawMany();

      const userData = {
        id: userRawData?.repUserID,
        count: parseInt(userRawData?.count || '0', 10),
      };

      const channelData = channelRawData.map((datum) => ({
        id: datum.repChannelID,
        count: parseInt(datum.count, 10),
      }));

      embed
        .setTitle(
          stripIndent`Reputation of ${
            member?.displayName || message.member.displayName
          }`
        )
        .setDescription('Reputation profile with breakdown of top 5 channels.')
        .setThumbnail(
          member?.user.displayAvatarURL({ dynamic: true }) ??
            message.member.user.displayAvatarURL({ dynamic: true })
        )
        .addField('Total', userData.count);

      for (const channelDatum of channelData) {
        const channel = message.guild.channels.resolve(channelDatum.id);
        embed.addField(
          channel?.name || 'deleted channel',
          channelDatum.count,
          true
        );
      }

      return await message.util?.send(embed);
    } catch (error) {
      this.logger.error('Reputation Profile Command error:', error);

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
