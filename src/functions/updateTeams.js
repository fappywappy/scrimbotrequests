const { RichEmbed } = require('discord.js');

module.exports = async function (bot) {
  const { teams } = bot.resources;

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  
  // Embed fields for team panel 1 (#1 - #15).
  for (let i = 0; i < 15; i++) {
    const { players } = teams[i];

    embed.fields[i] = {
      name: `Slot ${i + 1} - Team ${teams[i].name}`,
      value: players.reduce((str, p, idx) => {
        return str + `• <@${p}>${idx < players.length - 1 ? '\n' : ''}`
      }, '') || '• None',
      inline: true,
    }
  }

  const { COMMAND_PREFIX } = bot.config;
  bot.team_panel_1.edit(embed);

  // Embed fields for team panel 2 (#16 - #30).
  for (let i = 0; i < 15; i++) {
    const { players } = teams[i+15];

    embed.fields[i] = {
      name: `Slot ${i+16} - Team ${teams[i+15].name}`,
      value: players.reduce((str, p, idx) => {
        return str + `• <@${p}>${idx < players.length - 1 ? '\n' : ''}`
      }, '') || '• None',
      inline: true,
    }
  }

  embed.setFooter('Updated');
  embed.setTimestamp(new Date());
  bot.team_panel_2.edit(embed);
}