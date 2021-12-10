import type { MessageReaction, User } from 'discord.js';
import ReactionRole from 'entities/ReactionRole';
import RuppyListener from 'structures/RuppyListener';

export default class ReactionRoleAddListener extends RuppyListener {
  public constructor() {
    super('ReactionRoleAdd', {
      emitter: 'client',
      event: 'messageReactionAdd',
    });
  }

  public override async exec(reaction: MessageReaction, user: User) {
    if (user.id === this.client.user?.id || !reaction.message.guild || user.bot)
      return;

    try {
      const reactionRoles = await ReactionRole.find({
        where: { messageID: reaction.message.id },
      });

      if (reactionRoles.length > 0) {
        if (reaction.partial) await reaction.fetch();

        const member = await reaction.message.guild.members.fetch({ user });
        const giveRoles = [];

        for (const reactRole of reactionRoles) {
          if (reactRole.emoji === reaction.emoji.toString()) {
            giveRoles.push(member.roles.add(reactRole.role));
          }
        }

        await Promise.all(giveRoles);
      }
    } catch (error) {
      this.logger.error('ReactionRoleAdd error:', error);
    }
  }
}
