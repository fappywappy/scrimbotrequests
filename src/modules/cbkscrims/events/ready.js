import ScrimManager from '../../scrims/ScrimManager';
import setMemberVariables from './functions/setMemberVariables';
import loadCommands from './functions/loadCommands';

export default function ready(bot) {
  // Successfully logged into Discord.
  console.log(`Logged in as ${bot.user.tag}!`);

  // Set the bot activity.
  this.user.setActivity(`${bot.config.prefix}help`);

  // Set the bot guild and channel variables.
  await setMemberVariables(bot);

  loadCommands(bot);

  bot.scrims = new ScrimManager(bot);
}

export default async function setMemberVariables(bot) {
  const { GUILD, TEAM_CHANNEL, REQUESTS_CHANNEL, LOG_CHANNEL } = bot.config;

  // Defining guild.
  bot.guild = bot.client.guilds.get(GUILD);

  const { channels } = bot.guild;

  // Defining channels.
  bot.teamChannel = channels.get(TEAM_CHANNEL);
  bot.requestsChannel = channels.get(REQUESTS_CHANNEL);
  bot.logChannel = channels.get(LOG_CHANNEL);

  bot.resources.teams = bot.resources.teams.map((team) => {
    return {
      name: team.name,
      players: team.players,
      points: 0,
      game1position: 0,
      game2position: 0,
      game3position: 0,
      game1kills: 0,
      game2kills: 0,
      game3kills: 0,
    }
  })
}