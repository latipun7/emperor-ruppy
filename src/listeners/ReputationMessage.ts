import User from 'entities/User';
import RuppyListener from 'structures/RuppyListener';
import Guild from 'entities/Guild';
import { THANKS_REGEX } from 'src/constants';
import type { Message, User as DiscordUser } from 'discord.js';
import Reputation from 'entities/Reputation';

export default class ReputationMessageListener extends RuppyListener {
  public constructor() {
    super('reputationMessage', {
      emitter: 'client',
      event: 'message',
    });
  }

  async getOrMakeUser(mentionUser: DiscordUser, msgGuildID?: string) {
    try {
      let user = await User.createQueryBuilder('user')
        .innerJoinAndSelect('user.guilds', 'guild')
        .where('guild.guildID = :id', { id: msgGuildID })
        .getOne();

      if (!user) {
        const guild = await Guild.create({ guildID: msgGuildID }).save();
        user = await User.create({
          userID: mentionUser.id,
          guilds: [guild],
        }).save();
      }

      return user;
    } catch (error) {
      this.logger.error('ReputationMessage error on get User:', error);
      return undefined;
    }
  }

  public async exec(message: Message) {
    const GIVE = '👍';
    // TODO: add cooldown for thanking same user, cancel thanks, etc
    // const PARTIAL_GIVE = '⏳';
    // const NO_GIVE = '❌';

    const exec = THANKS_REGEX.exec(message.content);

    if (!message.author.bot || exec || message.guild) {
      const guildID = message.guild?.id;

      const mentionUsers = message.mentions.users.array();
      if (!mentionUsers.length) return;

      try {
        const repUser = [];
        for (const mentionUser of mentionUsers) {
          const user = this.getOrMakeUser(mentionUser, guildID).then(
            (userEntity) => {
              Reputation.create({
                user: userEntity,
                channelID: message.channel.id,
                messageID: message.id,
              })
                .save()
                .catch((error) => {
                  throw new Error(error);
                });
            }
          );

          repUser.push(user);
        }

        await Promise.all(repUser);

        await message.react(GIVE);
      } catch (error) {
        this.logger.error('ReputationMessage error:', error);
      }
    }
  }
}
