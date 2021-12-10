/* eslint-disable no-await-in-loop */
// import { getConnection } from 'typeorm';
import type { Message, User as DiscordUser } from 'discord.js';
import Guild from 'entities/Guild';
import Reputation from 'entities/Reputation';
import User from 'entities/User';
import RuppyListener from 'structures/RuppyListener';

export default class ReputationMessageListener extends RuppyListener {
  public constructor() {
    super('ReputationMessage', {
      emitter: 'client',
      event: 'message',
    });
  }

  static async getOrMakeUser(mentionUser: DiscordUser, msgGuildID: string) {
    let user = await User.findOne(mentionUser.id);

    if (!user) {
      const guild = await Guild.create({ guildID: msgGuildID }).save();

      user = await User.create({
        userID: mentionUser.id,
        guilds: [guild],
      }).save();
    }

    return user;
  }

  public override async exec(message: Message) {
    // TODO: add cooldown for thanking same user, cancel thanks, etc
    // PARTIAL_GIVE = '⏳';
    // NO_GIVE = '❌';
    const THANKS_REGEX =
      /\b(?:thanks|thx|ty|tyvm|tysm|thanku|thank you|thank u|makasih|terima kasih|terimakasih)\b/i;
    const thanksMatch = THANKS_REGEX.exec(message.content);

    if (message.author.bot || !message.guild || !thanksMatch) return;

    try {
      const guildID = message.guild?.id;
      const channelID = message.channel.id;
      const mentionUsers = message.mentions.users.array();

      if (!mentionUsers.length) return;

      for (const mentionUser of mentionUsers) {
        if (mentionUser.id !== message.author.id && !mentionUser.bot) {
          const user = await ReputationMessageListener.getOrMakeUser(
            mentionUser,
            guildID
          );

          // await getConnection().queryResultCache?.remove([
          //   `${guildID}_guild_rep`,
          //   `${channelID}_channel_rep`,
          //   `${guildID}_${mentionUser.id}_guild_member_rep`,
          //   `${guildID}_${mentionUser.id}_channel_member_rep`,
          // ]);
          await Reputation.create({
            user,
            guildID,
            channelID,
            messageID: message.id,
          }).save();
          await message.react('👍');
        }
      }
    } catch (error) {
      this.logger.error('ReputationMessage error:', error);
    }
  }
}
