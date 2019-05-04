const hasPermission = require('../utils/hasPermission');
const errorMsg = require('../utils/errorMsg');
const successMsg = require('../utils/successMsg.js')
const logEvent = require('../utils/logEvent');

const saveResources = require('../database/saveResources');
const updateTeams = require('../functions/updateTeams');

module.exports = async function (bot, args, msg) {
  if (!hasPermission(bot, msg)) {
    return errorMsg(msg, `You don't have permission to run this command.`);
  };

  if (!args.length) {
    return errorMsg(msg, 'Please provide a user to remove.');
  };

  const rawUser = args[0];
  const matchID = rawUser.match(/\d+/);

  if (!matchID) {
    return errorMsg(msg, 'Please provide a valid user to remove.');
  }

  const user_id = matchID[0];

  const { teams } = bot.resources;
  let found = false;

  for (let i = 0; i < teams.length; i++) {
    let { players } = teams[i];

    const inTeam = bot.resources.teams[i].players.some(playerID => playerID === user_id)
    if (inTeam) {
      bot.resources.teams[i].players = players.filter((player) => {
        if (player === user_id) {
          found = true;
          return false;
        };
        return true;
      })
    }
  }

  if (!found) {
    return errorMsg(msg, `${rawUser} not found in a [team](${bot.team_panel_1.url}).`);
  }
  `**__Statist`**__Statistics__**\nGame 1: #${teams[i].game1position}\nGame 2: #${teams[i].game2position}\nGame 3: #${teams[i].game3position}\nKills: ${teams[i].game1kills + teams[i].game2kills + teams[i].game3kills}\nPoints: ${teams[i].points}\n\n**__Players__**\n` + 
  (players.reduce((str, p, idx) => {
    return str + `- <@${p}>${idx < players.length - 1 ? '\n' : (players.length === 4) ? '' : '\n'}`
  }, '')) + emptyPlayersStr + '\n--------------------------------'ics__**\nGame 1: #${teams[i].game1position}\nGame 2: #${teams[i].game2position}\nGame 3: #${teams[i].game3position}\nKills: ${teams[i].game1kills + teams[i].game2kills + teams[i].game3kills}\nPoints: ${teams[i].points}\n\n**__Players__**\n` + 
  (players.reduce((str, p, idx) => {
    return str + `- <@${p}>${idx < players.length - 1 ? '\n' : (players.length === 4) ? '' : '\n'}`
  }, '')) + emptyPlayersStr + '\n--------------------------------'
  saveResources(bot);
  updateTeams(bot);

  const { INTEAM_ROLE } = bot.config;

  try {
    const member = await bot.guild.fetchMember(user_id);
    member.removeRole(INTEAM_ROLE)
  } catch (e) {};

  successMsg(msg, `${rawUser} has successfully been removed from all [teams](${bot.team_panel_1.url}).`);
  logEvent(bot, `${rawUser} has been removed from all teams.`);
}