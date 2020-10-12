import { Message } from 'discord.js';
import { RuppyCommand } from 'structures/RuppyCommand';
import RuppyListener from 'structures/RuppyListener';

export default class CommandCooldownListener extends RuppyListener {
  public constructor() {
    super('CommandCooldown', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'cooldown',
    });
  }

  public async exec(message: Message, _: RuppyCommand, remaining: number) {
    try {
      await message.react('⌚');

      setTimeout(() => {
        message.reactions.cache
          .get('⌚')
          ?.users?.remove()
          .catch((err) => this.logger.error(err));
      }, remaining);
    } catch (error) {
      this.logger.error('CommandCooldown error:', error);
    }
  }
}
