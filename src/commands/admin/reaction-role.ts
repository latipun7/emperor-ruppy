import { Argument } from 'discord-akairo';
import emojiRegex from 'emoji-regex/es2015';
import { oneLine, stripIndent } from 'common-tags';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import Guild from 'entities/Guild';
import ReactionRole from 'entities/ReactionRole';
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
      ratelimit: 2,
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
          type: Argument.union(
            'emoji',
            Argument.validate('string', (_, userInput) => {
              const regex = emojiRegex();
              const match = regex.exec(userInput);

              return !!match;
            })
          ),
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
    try {
      await message.react(emoji);

      let guild = await Guild.findOne(role.guild.id);

      if (!guild) {
        guild = await Guild.create({ guildID: role.guild.id }).save();
      }

      await ReactionRole.create({
        messageID: message.id,
        channelID: message.channel.id,
        emoji: emoji.toString(),
        role: role.id,
        guild,
      }).save();

      return await msg.util?.send(
        oneLine`Reaction role added to ${message.url}`
      );
    } catch (error) {
      this.logger.error('Reaction Role Command error:', error);

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
