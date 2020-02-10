
function calculatePoints(bot) {
  for (let i = 0; i < bot.resources.teams.length; i++) {
    const team = bot.resources.teams[i];
    let points = 0;
    points += bot.config.PLACES[team.game1position];
    points += bot.config.PLACES[team.game2position];
    points += bot.config.PLACES[team.game3position];
    points += bot.config.KILL_POINTS * team.game1kills;
    points += bot.config.KILL_POINTS * team.game2kills;
    points += bot.config.KILL_POINTS * team.game3kills;

    bot.resources.teams[i].points = points;
  }
}

function checkRequests(bot) {
  setInterval(async () => {
    const msgs = await bot.requestsChannel.fetchMessages({limit: 99});

    const { requests } = bot.resources;

    for (let user_id in requests) {
      const request = requests[user_id];
      const msg_id = request.message_id;

      if (!msgs.has(msg_id)) {
        delete bot.resources.requests[user_id];
        saveResources(bot);

        sendDM(bot, user_id, 'It seems your request has been deleted.')
        logEvent(bot, `<@${user_id}>'s request has been deleted.`);
      }
    }
  }, 15000)
}

function clearRequests(bot) {
  await bot.requestsChannel.bulkDelete(100, true);
  bot.resources.requests = {};
  saveResources(bot);
}

function initTeams(bot) {
  const { teamChannel } = bot;

  const embed = new RichEmbed();
  embed.setColor(0x36393E)
  embed.setDescription('Loading...');

  // If team panel message exists, edit it. Otherwise, create a new message.
  try {
    bot.team_panel_1 = await teamChannel.fetchMessage(bot.resources.meta.team_panel_1);
    bot.team_panel_1.edit(embed);
  } catch (e) {
    bot.team_panel_1 = await teamChannel.send(embed);
    bot.resources.meta.team_panel_1 = bot.team_panel_1.id;
  }

  // Do the same for panel 2.
  try {
    bot.team_panel_2 = await teamChannel.fetchMessage(bot.resources.meta.team_panel_2);
    bot.team_panel_2.edit(embed);
  } catch (e) {
    bot.team_panel_2 = await teamChannel.send(embed);
    bot.resources.meta.team_panel_2 = bot.team_panel_2.id;
  }

  bot.saveResources(bot);
}

function logEvent (bot, content) {
  const { logChannel } = bot;

  const embed = new RichEmbed();
  embed.setColor(0xff6961)
  embed.setDescription(content);
  
  logChannel.send(embed);
}

function orderByPoints(bot) {
  bot.resources.teams = bot.resources.teams.sort((a, b) => {
    return b.points - a.points;
  });
}

function updateTeams(bot) {
  const { teams } = bot.resources;

  const embed = new RichEmbed();
  let authorText = bot.inScrim ? '' : 'SCRIM INACTIVE';
  const color = bot.inScrim ? 0x77dd77 : 0x36393E;

  if (bot.inScrim) {
    if (!bot.game1positions) {
      authorText += 'WAITING FOR GAME 1 PLACEMENT RESULTS'
    } else if (!bot.game1kills) {
      authorText += 'WAITING FOR GAME 1 KILL RESULTS'
    } else if (!bot.game2positions) {
      authorText += 'WAITING FOR GAME 2 PLACEMENT RESULTS'
    } else if (!bot.game2kills) {
      authorText += 'WAITING FOR GAME 2 KILL RESULTS'
    } else if (!bot.game3positions) {
      authorText += 'WAITING FOR GAME 3 PLACEMENT RESULTS'
    } else if (!bot.game3kills) {
      authorText += 'WAITING FOR GAME 3 KILL RESULTS'
    } else {
      bot.resultsRecorded = true;
      authorText += 'SCRIM RESULTS RECORDED - WAITING FOR STAFF'
    }
  }

  if (bot.isLocked) {
    authorText += ' | TEAMS LOCKED'
  } else {
    authorText += ' | TEAMS UNLOCKED'
  }

  authorText += ` | ${teams.reduce((sum, team) => sum + team.players.length, 0)}/120 PLAYERS`

  embed.setAuthor(authorText)
  embed.setColor(color);
  
  // Embed fields for team panel 1 (#1 - #15).
  for (let i = 0; i < 15; i++) {
    const { players } = teams[i];

    let emptyPlayersStr = '';
    for (let j = 0; j < 4 - players.length; j++) {
      emptyPlayersStr += '-';

      if (j < 4 - players.length - 1) emptyPlayersStr += '\n';
    }

    embed.fields[i] = {
      name: `◄  ${teams[i].name} | ${i + 1} ►`,
      value: `**__Statistics__**\nGame 1: #${teams[i].game1position}\nGame 2: #${teams[i].game2position}\nGame 3: #${teams[i].game3position}\nKills: ${teams[i].game1kills + teams[i].game2kills + teams[i].game3kills}\nPoints: ${teams[i].points}\n\n**__Players__**\n` + 
      (players.reduce((str, p, idx) => {
        return str + `- <@${p}>${idx < players.length - 1 ? '\n' : (players.length === 4) ? '' : '\n'}`
      }, '')) + emptyPlayersStr + '\n--------------------------------',
      inline: true,
    }
  }

  const { COMMAND_PREFIX } = bot.config;
  bot.team_panel_1.edit(embed);

  // Embed fields for team panel 2 (#16 - #30).
  for (let i = 0; i < 15; i++) {
    const { players } = teams[i+15];

    let emptyPlayersStr = '';
    for (let j = 0; j < 4 - players.length; j++) {
      emptyPlayersStr += '-';

      if (j < 4 - players.length - 1) emptyPlayersStr += '\n';
    }

    embed.fields[i] = {
      name: `◄  ${teams[i+15].name} | ${i + 16} ►`,
      value: `**__Statistics__**\nGame 1: #${teams[i+15].game1position}\nGame 2: #${teams[i+15].game2position}\nGame 3: #${teams[i+15].game3position}\nKills: ${teams[i+15].game1kills + teams[i+15].game2kills + teams[i+15].game3kills}\nPoints: ${teams[i+15].points}\n\n**__Players__**\n` + 
      (players.reduce((str, p, idx) => {
        return str + `- <@${p}>${idx < players.length - 1 ? '\n' : (players.length === 4) ? '' : '\n'}`
      }, '')) + emptyPlayersStr + '\n--------------------------------',
      inline: true,
    }
  }
  
  bot.team_panel_2.edit(embed);
}