export default function setMemberVariables(botModule) {  
  botModule.state = {
    locked = false,
    playing = false,
    resultsRecorded = false,
    positionsRecorded = {
      game1: false,
      game2: false,
      game3: false,
    },
    killsRecorded = {
      game1: false,
      game2: false,
      game3: false,
    },
  }
  
  botModule.panels = {};
  
  botModule.guild = botModule.bot.client.guilds.get(botModule.config.guild);
  botModule.channels = {
    team: botModule.guild.channels.get(botModule.config.channels.team),
    requests = botModule.guild.channels.get(botModule.config.channels.requests),
    log = botModule.guild.channels.get(botModule.config.channels.log),
  }
  
  botModule.resources.teams = botModule.resources.teams.map(team => {
    return {
      name: team.name,
      players: team.players,
      points: 0,
      games: {
        game1: {
          position: 0,
          kills: 0,
        },
        game2: {
          position: 0,
          kills: 0,
        },
        game3: {
          position: 0,
          kills: 0,
        }
      }
    }
  })
}
