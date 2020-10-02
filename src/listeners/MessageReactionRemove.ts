import ReactionRole from 'entities/ReactionRole';
import RuppyListener from 'structures/RuppyListener';
import type { MessageReaction, User } from 'discord.js';

export default class MessageReactionRemoveListener extends RuppyListener {
  public constructor() {
    super('messageReactionRemove', {
      emitter: 'client',
      event: 'messageReactionRemove',
    });
  }

  public async exec(reaction: MessageReaction, user: User) {
    if (user.id === this.client.user?.id || !reaction.message.guild || user.bot)
      return;

    try {
      const reactionRoles = await ReactionRole.find({
        where: { messageID: reaction.message.id },
      });

      if (reactionRoles.length > 0) {
        if (reaction.partial) await reaction.fetch();

        const member = await reaction.message.guild.members.fetch({ user });
        const removeRoles = [];

        for (const reactRole of reactionRoles) {
          if (reactRole.emoji === reaction.emoji.toString()) {
            removeRoles.push(member.roles.remove(reactRole.role));
          }
        }

        await Promise.all(removeRoles);
      }
    } catch (error) {
      this.logger.error('messageReactionRemove error:', error);
    }
  }
}
