import { RichEmbed } from 'discord.js';

export default function sendLog(botModule, content) {
  try {
    botModule.channels.log.send(new RichEmbed()
      .setColor(botModule.config.colors.log)
      .setDescription(content)
    );
  } catch (e) {
    console.error(`
      Failed to send log message in channel ${botModule.channels.log.id}.
      Message Content: ${content}
      Error Information: ${e}`
    );
  }
}