import { stripIndents } from 'common-tags';
import type { Category } from 'discord-akairo';
import {
  MessageEmbed,
  type Message,
  type PermissionResolvable,
} from 'discord.js';
import { capitalizeFirstCharacter } from 'lib/utils';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';

interface CmdArgs {
  command?: RuppyCommand;
}

export default class HelpCommand extends RuppyCommand {
  public constructor() {
    super('help', {
      category: CmdCategories.Util,
      ratelimit: 1,
      description: {
        content:
          'Display list of available commands and detailed information of specific command.',
        usage: '[command]',
        examples: ['', 'ping'],
      },
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          prompt: {
            optional: true,
            retry: 'Invalid argument provided.',
          },
        },
      ],
    });
  }

  public override async exec(message: Message, { command }: CmdArgs) {
    const embed = new MessageEmbed().setColor('#41B0FD');
    const prefix = await this.getPrefix(message);

    if (command) {
      const [primaryCommandAlias] = command.aliases;
      const { content, examples, usage } = command.description;

      embed
        .setTitle(`${capitalizeFirstCharacter(primaryCommandAlias)} Command`)
        .setDescription(
          stripIndents`
            Detailed usage of the command.
            _Note on usage: \`[ ]\` means optional, \`< >\` means required._
          `
        )
        .addField('Description', content)
        .addField(
          'Usage',
          stripIndents`
            \`${prefix}${primaryCommandAlias}${usage ? ` ${usage}` : ''}\`
          `
        );

      if (command.aliases.length > 1) {
        const aliases = RuppyCommand.getAliases(command);

        embed.addField(
          'Aliases',
          aliases ? aliases.map((alias) => `\`${alias}\``).join(', ') : '\u200B'
        );
      }

      if (examples) {
        embed.addField(
          'Examples',
          stripIndents`
            \`\`\`
            ${examples
              .map((sample) => `${prefix}${primaryCommandAlias} ${sample}`)
              .join('\n\n')}
            \`\`\`
          `
        );
      }

      return message.util?.send(embed);
    }

    embed
      .setTitle('Commands Help')
      .setDescription(
        stripIndents`
        For additional info for a command use \`${prefix}help <command>\`

        __Note__:
        • Add prefix \`${prefix}\` in front of the command. Example: \`${prefix}ping\`.
        • Or you could mention the bot, then the command. Example: ${this.client.user} ping
        • When command has ⌚ reaction on it, it means you are on cooldown of that command.
        • Commands or aliases containing dash ( \`-\` ), would be valid with or without it.
          Example: command \`reaction-role\` is valid as both \`reaction-role\` or \`reactionrole\`

        Below are all the available commands:
        \u200B
      `
      )
      .setFooter('Hover over command for basic additional info.');

    const authorIsOwner = this.client.isOwner(message.author);
    const isGuildMsg = !!message.guild;
    const categories = this.handler.categories.values() as IterableIterator<
      Category<string, RuppyCommand>
    >;

    for (const category of categories) {
      // Only show categories if all of the following are true:
      // 	1. The message author is an owner or Some commands are not owner-only
      //  2. Some commands are visible
      if (
        (authorIsOwner || category.some((cmd) => !cmd.ownerOnly)) &&
        category.some((cmd) =>
          message.member
            ? !(cmd.channel === 'dm') &&
              message.member.hasPermission(
                cmd.userPermissions as PermissionResolvable
              )
            : !(cmd.channel === 'guild')
        )
      ) {
        embed.addField(
          capitalizeFirstCharacter(category.id),
          category
            // remove owner-only commands if you are not an owner
            // remove sub-commands
            // remove guild command if in dm, remove dm command if in guild
            // remove commands that user doesn't have the permission in guild
            .filter((cmd) => {
              const isOwnerOnlyForOwner = authorIsOwner ? true : !cmd.ownerOnly;
              const isNotSubCmd = cmd.aliases.length > 0;
              const isGuild = isGuildMsg
                ? !(cmd.channel === 'dm')
                : !(cmd.channel === 'guild');
              const isUserHasPermission = message.member
                ? message.member.hasPermission(
                    cmd.userPermissions as PermissionResolvable
                  )
                : true;

              return (
                isOwnerOnlyForOwner &&
                isNotSubCmd &&
                isGuild &&
                isUserHasPermission
              );
            })
            .map((cmd) => {
              const aliases = RuppyCommand.getAliases(cmd);
              const mapAlias = aliases?.map((alias) => `${alias}`).join(', ');

              return `[\`${cmd.aliases[0]}\`](https://latipun.dev "${
                cmd.description.content
              }${mapAlias ? `\n\nAlias: ${mapAlias}` : ''}")`;
            })
            .join(', '),
          true
        );
      }
    }

    return message.util?.send(embed);
  }
}
