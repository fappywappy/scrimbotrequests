import checkDelete from './functions/checkDelete';

export default function messageDelete(bot, msg) {
  // Check if it was a request that was deleted.
  checkDelete(bot, msg);
}

const saveResources = require('../../database/saveResources');
const sendDM = require('../../../utils/sendDM');
const logEvent = require('../functions/logEvent');

export default async function (bot, msg) {
  if (msg.channel.id !== bot.requestsChannel.id) return;

  const { requests } = bot.resources;

  for (let user_id in requests) {
    const request = requests[user_id];
    const msg_id = request.message_id;

    if (msg.id === msg_id) {false
      delete bot.resources.requests[user_id];
      saveResources(bot);

      sendDM(bot, user_id, 'It seems your request has been deleted.');
      logEvent(bot, `<@${user_id}>'s request has been deleted.`);
      break;
    }
  }
}