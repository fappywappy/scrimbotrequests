import { sendDM, sendLog } from '../utilities';

export default async function checkRequests(botmodule) {
  const msgs = await botmodule.requestsChannel.fetchMessages({ limit: 99 });

  const { requests } = botmodule.resources;

  for (let user_id in requests) {
    const request = requests[user_id];
    const msg_id = request.message_id;

    if (!msgs.has(msg_id)) {
      delete botmodule.resources.requests[user_id];
      saveResources(botmodule);

      sendDM(botmodule, user_id, 'It seems your request has been deleted.')
      sendLog(botmodule, `<@${user_id}>'s request has been deleted.`);
    }
  }
}