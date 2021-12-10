import { stripIndent } from 'common-tags';
import { MessageEmbed, type Message } from 'discord.js';
import packageJSON from 'package.json';
import prettyMilliseconds from 'pretty-ms';
import { CmdCategories, RuppyCommand } from 'structures/RuppyCommand';

export default class BotInfoCommand extends RuppyCommand {
  public constructor() {
    super('bot-info', {
      aliases: ['stats'],
      category: CmdCategories.Info,
      clientPermissions: 'EMBED_LINKS',
      ratelimit: 2,
      description: {
        content: 'Display information / statistic about this bot.',
      },
    });
  }

  public override async exec(message: Message) {
    const thisYear = new Date().getFullYear();
    const embed = new MessageEmbed()
      .setColor('#FFBF34')
      .setDescription(
        `**${this.client.user?.username || 'Emperor Ruppy'}'s Information**`
      )
      .addField('⏲ Uptime', prettyMilliseconds(this.client.uptime ?? 0), true)
      .addField(
        '⚡ Memory Usage',
        `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        true
      )
      .addField(
        '💎 General Stats',
        stripIndent`
				• Guilds: ${this.client.guilds.cache.size}
				• Channels: ${this.client.channels.cache.size}
			`,
        true
      )
      .addField('✨ Version', `${packageJSON.version}`, true)
      .addField(
        '👨‍💻 Source Code',
        "[Emperor Ruppy's GitHub](https://github.com/latipun7/emperor-ruppy)",
        true
      )
      .setThumbnail(this.client.user?.displayAvatarURL({ dynamic: true }) ?? '')
      .setFooter(`© ${thisYear} Latipun7`);

    return message.util?.send(embed);
  }
}
