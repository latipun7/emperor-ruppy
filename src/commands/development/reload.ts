import { Argument, Command, Inhibitor, Listener } from 'discord-akairo';
import { oneLine, stripIndent } from 'common-tags';
import ms from 'pretty-ms';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import { startTimer } from 'lib/utils';
import type { Message } from 'discord.js';
import type { AkairoModule } from 'discord-akairo';

interface CmdArgs {
  module: AkairoModule | RuppyCommand | Listener | Inhibitor;
}

export default class ReloadCommand extends RuppyCommand {
  public constructor() {
    super('reload', {
      aliases: [
        'reload-module',
        'reload-command',
        'reload-listener',
        'reload-inhibitor',
      ],
      category: CmdCategories.Develop,
      ownerOnly: true,
      description: {
        content: 'Reload a module (command, listener, or inhibitor).',
        usage: '<Module>',
        examples: ['ping'],
      },
      args: [
        {
          id: 'module',
          type: Argument.union('commandAlias', 'listener', 'inhibitor'),
          match: 'content',
          prompt: {
            start: 'which module do you want to reload?',
            retry: 'Invalid module provided.',
          },
        },
      ],
    });
  }

  public async exec(message: Message, args: CmdArgs) {
    const endTimer = startTimer();

    let reloaded;

    try {
      reloaded = args.module.reload();

      const elapsed = endTimer();

      let type = 'module';

      if (reloaded instanceof Command) {
        type = 'command';
      } else if (reloaded instanceof Listener) {
        type = 'listener';
      } else if (reloaded instanceof Inhibitor) {
        type = 'inhibitor';
      }

      return await message.util?.send(
        oneLine`
          Reloaded ${type} \`${reloaded.categoryID}:${reloaded.id}\`
          in ${ms(elapsed)}
        `
      );
    } catch (error) {
      return await message.util?.send(
        stripIndent`
          An error occurred while reloading.
          \`\`\`bash
          ${error}
          \`\`\`
        `
      );
    }
  }
}
