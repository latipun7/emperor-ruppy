import ms from 'pretty-ms';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message } from 'discord.js';

export default class PingCommand extends RuppyCommand {
  public constructor() {
    super('ping', {
      aliases: ['hello', 'heart-beat'],
      category: CmdCategories.Util,
      ratelimit: 2,
      description: { content: "Checks the bot's ping to the Discord server." },
    });
  }

  public async exec(message: Message) {
    const response = await message.util?.send('⏳ Pinging…');

    if (response) {
      const timestamps = {
        response: response.editedTimestamp ?? response.createdTimestamp,
        original: message.editedTimestamp ?? message.createdTimestamp,
      };

      return message.util?.edit(
        [
          `🔂 The message round-trip took **${ms(
            timestamps.response - timestamps.original,
            { formatSubMilliseconds: true }
          )}**`,
          `💟 The heartbeat ping to Discord is **${ms(this.client.ws.ping, {
            formatSubMilliseconds: true,
          })}**`,
        ].join('\n')
      );
    }

    return undefined;
  }
}
