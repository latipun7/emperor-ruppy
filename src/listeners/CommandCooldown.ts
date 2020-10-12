import { Message } from 'discord.js';
import { RuppyCommand } from 'structures/RuppyCommand';
import RuppyListener from 'structures/RuppyListener';

export default class CommandCooldownListener extends RuppyListener {
  public constructor() {
    super('commandCooldown', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'cooldown',
    });
  }

  public async exec(message: Message, _: RuppyCommand, remaining: number) {
    await message.react('⌚');

    setTimeout(() => {
      message.reactions.removeAll().catch((err) => this.logger.error(err));
    }, remaining);
  }
}
