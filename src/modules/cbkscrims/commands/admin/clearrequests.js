const hasPermission = require('../../events/utils/hasPermission');
const errorMsg = require('../../utils/errorMsg.js');
const successMsg = require('../../utils/successMsg.js');
const logEvent = require('../../scrims/functions/logEvent');
const clearRequests = require('../../scrims/functions/clearRequests');

const saveResources = require('../../database/saveResources');
const updateTeams = require('../../scrims/functions/updateTeams');

export default async function (bot, args, msg) {
  if (!hasPermission(bot, msg)) {
    return errorMsg(msg, `You don't have permission to run this command.`);
  };
  
  clearRequests(bot);
  successMsg(msg, 'Requests have been cleared.');
}