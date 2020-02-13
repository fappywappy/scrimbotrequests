import { RichEmbed } from 'discord.js';

export default function sendDM(botModule, content, userID) {
  try {
    botModule.guild.fetchMember(userID).then((member) =>
      member.send(new RichEmbed()
        .setColor(0x36393E)
        .setDescription(content)
      )
    );
  } catch (e) {
    console.error(`
      Failed to send DM to ${userID}.
      Message Content: ${content}
      Error Information: ${e}`
    );
  };
}