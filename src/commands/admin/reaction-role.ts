import { oneLine } from 'common-tags';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import ReactionRole from 'entities/ReactionRole';
import Guild from 'entities/Guild';
import type { EmojiResolvable, Message, Role } from 'discord.js';

interface CmdArgs {
  message: Message;
  emoji: EmojiResolvable;
  role: Role;
}

export default class ReactionRoleCommand extends RuppyCommand {
  public constructor() {
    super('reactionrole', {
      aliases: ['react-role'],
      category: CmdCategories.Admin,
      clientPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS'],
      userPermissions: ['MANAGE_ROLES'],
      channel: 'guild',
      description: {
        content: 'Add self-assign roles to server.',
      },
      args: [
        {
          id: 'message',
          type: 'guildMessage',
          prompt: {
            start: 'enter the message ID the reactrole attached to!',
            retry: "Can't resolve message.",
          },
        },
        {
          id: 'emoji',
          type: 'emoji',
          prompt: {
            start:
              'enter the custom emoji in this server or the default emoji for react!',
            retry: "Can't resolve emoji.",
          },
        },
        {
          id: 'role',
          type: 'role',
          prompt: {
            start:
              'which role the reaction bound to? (example mention: `@myroles`)',
            retry: "Can't resolve role.",
          },
        },
      ],
    });
  }

  public async exec(msg: Message, { message, emoji, role }: CmdArgs) {
    await message.react(emoji);

    const guild = new Guild();
    guild.guildID = role.guild.id;
    await guild.save();

    const reactRole = new ReactionRole();
    reactRole.messageID = message.id;
    reactRole.channelID = message.channel.id;
    reactRole.guild = guild;
    reactRole.emoji = emoji.toString();
    reactRole.role = role.id;
    await reactRole.save();

    return msg.util?.send(oneLine`Reaction role added to ${message.url}`);
  }
}
