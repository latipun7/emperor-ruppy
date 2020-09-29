import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import { capitalizeFirstCharacter } from 'lib/utils';
import type { Message } from 'discord.js';
import type { PrefixSupplier } from 'discord-akairo';

interface CmdArgs {
  command?: RuppyCommand;
}

export default class HelpCommand extends RuppyCommand {
  public constructor() {
    super('help', {
      category: CmdCategories.Util,
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

  public async exec(message: Message, { command }: CmdArgs) {
    const embed = new MessageEmbed();
    let prefixes = await (this.handler.prefix as PrefixSupplier)(message);

    if (Array.isArray(prefixes)) {
      [prefixes] = prefixes;
    }

    const prefix = prefixes;

    if (command) {
      const [primaryCommandAlias] = command.aliases;
      const { content, examples, usage } = command.description;

      embed
        .setColor('#41B0FD')
        .setTitle(`${capitalizeFirstCharacter(primaryCommandAlias)} Command`)
        .addField('Description', content)
        .addField(
          'Usage',
          stripIndents`
            \`${prefix}${primaryCommandAlias}${usage ? ` ${usage}` : ''}\`

            _Note: \`[ ]\` means optional, \`< >\` means required._
          `
        );

      if (command.aliases.length > 1) {
        embed.addField(
          'Aliases',
          command.aliases.map((alias) => `\`${alias}\``).join(', ')
        );
      }

      if (examples) {
        embed.addField(
          'Examples',
          stripIndents`
            \`\`\`
            ${examples
              .map((sample) => `${prefix}${primaryCommandAlias} ${sample}`)
              .join('\n\nor\n\n')}
            \`\`\`
          `
        );
      }

      return message.util?.send(embed);
    }

    embed
      .setTitle('Commands')
      .setColor('#41B0FD')
      .setDescription(
        `For additional info for a command use \`${prefix}help <command>\``
      );

    const authorIsOwner = this.client.isOwner(message.author);

    this.handler.categories.forEach((category, id) => {
      // Only show categories if any of the following are true
      // 	1. The message author is an owner
      // 	2. Some commands are not owner-only
      if (authorIsOwner || category.some((cmd) => !cmd.ownerOnly)) {
        embed.addField(
          capitalizeFirstCharacter(id),
          category
            // Remove owner-only commands if you are not an owner
            .filter((cmd) => (authorIsOwner ? true : !cmd.ownerOnly))
            .map((cmd) => `\`${cmd.aliases[0]}\``)
            .join(', ')
        );
      }
    });

    return message.util?.send(embed);
  }
}
