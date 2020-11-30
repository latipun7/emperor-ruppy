import Axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { oneLine, stripIndent } from 'common-tags';
import { isEmptyObject } from 'lib/utils';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';
import type { Message, MessageEmbedOptions, TextChannel } from 'discord.js';
import type { AxiosResponse } from 'axios';
import type { URL } from 'url';

interface CmdArgs {
  embedOptionsLink: URL;
  textChannel: TextChannel;
  msgID?: Message;
}

export default class EmbedCommand extends RuppyCommand {
  public constructor() {
    super('embed', {
      category: CmdCategories.Admin,
      channel: 'guild',
      ratelimit: 2,
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      description: {
        content: 'Create / send custom message as embed in given channel.',
        usage: '<url-of-raw-json-embed-options> <channel>',
        examples: [
          '',
          'https://sourceb.in/raw/b37f59d120/0 #my-channel',
          'https://sourceb.in/raw/b37f59d120/0 #my-channel 779996697132138506',
        ],
      },
      args: [
        {
          id: 'embedOptionsLink',
          type: 'url',
          prompt: {
            start:
              'enter URL to raw JSON of embed options (exp: sourcebin, hastebin, etc)',
            retry: 'Not a valid URL.',
          },
        },
        {
          id: 'textChannel',
          type: 'textChannel',
          prompt: {
            start: 'enter channel ID the embed to send',
            retry: 'Channel not found with that ID.',
          },
        },
        {
          id: 'msgID',
          type: 'message',
          prompt: {
            optional: true,
            start: 'enter message ID for edit, otherwise, leave it "0"',
            retry: 'Message not found with that ID.',
          },
        },
      ],
    });
  }

  public async exec(
    message: Message,
    { embedOptionsLink, textChannel, msgID }: CmdArgs
  ) {
    try {
      const {
        data: receivedEmbed,
      }: AxiosResponse<MessageEmbedOptions> = await Axios.get(
        embedOptionsLink.toString()
      );

      if (isEmptyObject({ ...receivedEmbed })) {
        return await message.util?.send(
          'Sorry, the URL you provide has empty embed options.'
        );
      }
      // TODO: add more validation, using `ajv` ( https://github.com/ajv-validator/ajv )
      // https://discordjs.guide/popular-topics/embeds.html#embed-limits

      const now = new Date();
      const embed = new MessageEmbed(receivedEmbed).setTimestamp(now);

      if (msgID) {
        await msgID.edit(embed);
        return await message.util?.send(
          oneLine`Message successfully edited with embed. Link: ${msgID.url}`
        );
      }
      await textChannel.send(embed);
      return await message.util?.send(
        oneLine`Embed message successfully sent to ${textChannel}.`
      );
    } catch (error) {
      this.logger.error('Embed Command error:', error);

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
