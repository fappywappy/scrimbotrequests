const stripIndent = require('strip-indent');
const { RichEmbed } = require('discord.js');

module.exports = function (bot, args, msg) {
  const channel = msg.channel;
  const user = msg.author;

  const { COMMAND_PREFIX: prefix } = bot.config

  const embed = new RichEmbed();
  embed.setColor(0x36393E);
  embed.setDescription(`I have PM'd you ${msg.author} with the full list of commands/command definitions.`)

  channel.send(embed);

  const helpStr = stripIndent(`
  :sparkles: **Greetings!** :sparkles:

  The prefix to use my commands in server is \`${prefix}\`  
  Example:  \`${prefix}join 29 \`

  __General Commands__
  ~  **\\${prefix}join (1-30)**- request to join a team corresponding with the slot number.
  ~  **\\${prefix}cancelrequest**- cancel your request to join a team.
  ~  **\\${prefix}leave**- leave the team that you're in (if you are in one). 
  -  **\\${prefix}serverinfo**- server information, (member count, time&date of server creation, etc)

  __Staff Commands (Only Useable By Staff Members)__
  ~  **\\${prefix}scrimsignup (scrim name)**- notifies @everyone to sign up for scrims.
  ~  **\\${prefix}scrimstart (scrim name)**- notifies those in a team that the scrim is starting.
  ~  **\\${prefix}moveuser @user, (1-30)**- moves a user to the specified slot number.
  ~  **\\${prefix}removeuser @user**- removes a user from their team.
  ~  **\\${prefix}editteam (1-30), (new team name)**- edit the name of a team corresponding with the slot number.
  ~  **\\${prefix}moveteam (1-30), (1-30)**- moves a team from one slot number to another.

  Bot programmed by: https://www.fiverr.com/premiatech
  `);

  user.send(helpStr);
}
