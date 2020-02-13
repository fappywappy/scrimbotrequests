import { sendDM, sendLog } from '../utilities';

export default function onMessageDelete(botModule, message) {
  if (message.channel.id !== botModule.channels.requests.id) return;

  const { requests } = botModule.resources;

  for (let user_id in requests) {
    const request = requests[user_id];
    const message_id = request.message_id;

    if (message.id === message_id) {
      delete botModule.resources.requests[user_id];
      saveResources(botModule);

      sendDM(botModule, user_id, 'It seems your request has been deleted.');
      sendLog(botModule, `<@${user_id}>'s request has been deleted.`);
      break;
    }
  }
}