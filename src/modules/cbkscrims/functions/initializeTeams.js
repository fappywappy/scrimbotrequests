import { RichEmbed } from 'discord.js';

export default async function initailizeTeams(botmodule) {
  const embed = new RichEmbed()
    .setColor(botmodule.moduleSettings.colors.transparent)
    .setDescription('Loading...');

  for (let i = 1; i <= 2; i++) { // Initialize panels 1 and 2.
    try {
      botmodule.panels[i] = await botmodule.channels.team.fetchMessage(botmodule.resources.panels[1]);
      botmodule.panels[i].edit(embed);
    } catch (e) {
      botmodule.panels[i] = await botmodule.channels.team.send(embed);
      botmodule.resources.panels[i] = botmodule.panels[1].id;
    }
  }

  mod.saveResources(mod);
}