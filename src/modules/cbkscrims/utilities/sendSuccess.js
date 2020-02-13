import { RichEmbed } from 'discord.js';

export default function sendSuccess(botModule, content, channel) {
  try {
    channel.send(new RichEmbed()
      .setColor(botModule.config.colors.success)
      .setDescription(content)
    );
  } catch (e) {
    console.error(`
      Failed to send success message in channel ${channel.id}.
      Message Content: ${content}
      Error Information: ${e}`
    );
  }
}