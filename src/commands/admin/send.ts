import { oneLine, stripIndent } from 'common-tags';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message, NewsChannel, TextChannel } from 'discord.js';

interface CmdArgs {
  textChannel: NewsChannel | TextChannel;
  msgID?: Message;
  msgs: string;
}

export default class SendCommand extends RuppyCommand {
  public constructor() {
    super('send', {
      category: CmdCategories.Admin,
      ratelimit: 2,
      clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
      userPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
      description: {
        content: 'Create / send custom message in given channel.',
        usage: '<channel> [message-id-for-edit] <messages>',
        examples: [
          '',
          '#send-here "" send this new message',
          '#send-here 784682078000119809 edit that message with this',
        ],
      },
      args: [
        {
          id: 'textChannel',
          type: 'channel',
          prompt: {
            start: 'enter channel ID the message to send',
            retry: 'Channel not found with that ID.',
          },
        },
        {
          id: 'msgID',
          type: 'relevantMessage',
          prompt: {
            optional: true,
            start: 'enter message ID by this bot for edit',
            retry: 'Message not found with that ID.',
          },
        },
        {
          id: 'msgs',
          match: 'restContent',
          prompt: {
            start: 'enter the messages',
            retry: 'Input your messages.',
          },
        },
      ],
    });
  }

  public async exec(message: Message, { textChannel, msgID, msgs }: CmdArgs) {
    try {
      if (msgID) {
        await msgID.edit(msgs);
        return await message.util?.send(
          oneLine`Message successfully edited. Link: ${msgID.url}`
        );
      }

      await textChannel.send(msgs);
      return await message.util?.send(
        oneLine`Message successfully sent to ${textChannel}.`
      );
    } catch (error: unknown) {
      this.logger.error('Message Command error:', error);

      if (error instanceof Error) {
        return await message.util?.send(
          stripIndent`
            Sorry, something went wrong. Error info:
            \`\`\`js
            ${error.message}
            ${new Date().toISOString()}
            \`\`\`
          `
        );
      }

      return await message.util?.send(
        stripIndent`
          Sorry, something went wrong. Error info:
          \`\`\`js
          ${new Date().toISOString()}
          \`\`\`
        `
      );
    }
  }
}
