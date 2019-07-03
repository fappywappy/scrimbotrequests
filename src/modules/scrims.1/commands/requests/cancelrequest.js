import Command from '../../structures/Command';

export default class CancelRequest extends Command {
  constructor(bot) {
    super(bot, {
      name: 'cancelrequest',
      group: 'requests',
      description: 'Cancel your request.',
      aliases: ['cancel'],
      guildOnly: true,
      restricted: true,
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'text',
          type: 'string',
          default: '',
          validate: text => {
            if (text.length < 201) return true;
            return 'Message Content is above 200 characters';
          }
        }
      ]
    })
  }

  run(msg) {
    const { requests } = bot.resources;
    const user_id = msg.author.id;

    if (!requests.hasOwnProperty(user_id)) {
      return errorMsg(msg, 'You have no active requests.');
    }

    try {
      const requestMsg = await bot.requestsChannel.fetchMessage(requests[user_id].message_id);
      requestMsg.delete();
    } catch (e) { };

    delete bot.resources.requests[user_id];
    saveResources(bot);

    successMsg(msg, 'Your request has been successfully cancelled.');
    logEvent(bot, `<@${user_id}>'s request has been cancelled.`);
  }
}