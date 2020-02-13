import { RichEmbed } from 'discord.js';

export default function sendError(botModule, content, channel) {
  try {
    channel.send(new RichEmbed()
      .setColor(botModule.config.colors.error)
      .setDescription(content)
    );
  } catch (e) {
    console.error(`
      Failed to send error message in channel ${channel.id}.
      Message Content: ${content}
      Error Information: ${e}`
    );
  }
}