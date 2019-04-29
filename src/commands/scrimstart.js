const { RichEmbed } = require('discord.js');
const stripIndent = require('strip-indent');

const errorMsg = require('../utils/errorMsg.js');

module.exports = async function (bot, args, msg) {
  const { INTEAM_ROLE, COMMAND_PREFIX, TEAM_CHANNEL } = bot.config;

  if (!args.length) {
    return errorMsg(msg, 'Please provide a scrim name.');
  };

  const scrimName = args[0];

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  embed.setAuthor(`Scrim ${scrimName} is now starting!`, 'https://cdn3.iconfinder.com/data/icons/automobile-street/30/race-flag-512.png')
  embed.setDescription(stripIndent(`
    View the current roster in <#${TEAM_CHANNEL}>.
    Good luck and have fun!
  `));
  
  msg.channel.send(embed);
  msg.channel.send(`<@&${INTEAM_ROLE}>`).then(m => m.delete(1000));
  msg.delete(500);
}