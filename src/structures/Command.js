const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default class Command {
  constructor(info) {
    this.name = info.name;
    this.aliases = info.aliases || [];
    if (typeof info.autoAliases === 'undefined' || info.autoAliases) {
      if (this.name.includes('-')) this.aliases.push(this.name.replace(/-/g, ''));
      for (const alias of this.aliases) {
        if (alias.includes('-')) this.aliases.push(alias.replace(/-/g, ''));
      }
    }
    this.group = null;
    this.description = info.description;
    this.guildOnly = Boolean(info.guildOnly);
    this.throttling = info.throttling || null;
    this.hidden = Boolean(info.hidden);
    this._throttles = new Map();
  }

  static parseCommand(bot, msg) {
    const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|${escapeRegex(bot.config.prefix)})\\s*`);
    if (!prefixRegex.test(msg.content)) return;
  
    const [, matchedPrefix] = msg.content.match(prefixRegex);
    const rawArgs = msg.content.slice(matchedPrefix.length).trim().split(/ +/);
    const command = rawArgs.shift().toLowerCase();
  
    const args = (rawArgs.length ? 
      rawArgs.join(' ').split(/[,]+/).map(e => e.trim()) :
      rawArgs
    );
  
    return [command, args];
  };

  static isCommand(bot, msg) {
    const content = msg.content;
    
    const matchPrefix = content.startsWith(bot.config.prefix);
  
    const rawCommand = content.split(' ')[0];
    const matchReaction = /^(\<:).*\>$/.test(rawCommand);
  
    return matchPrefix || matchReaction;
  };

  hasPermission(bot, msg) {
    const { ALLOWED_ROLES } = bot.config;
    const channel = msg.channel;
    const memberRoles = msg.member.roles;
  
    if (!ALLOWED_ROLES.length) return true;
  
    const hasPermission = memberRoles.some((role) => {
      return ALLOWED_ROLES.some(allowedID => role.id === allowedID);
    });
  
    return hasPermission;
  };

  errorMsg(msg, error) {
    const { channel } = msg;
  
    const embed = new RichEmbed();
    embed.setColor(0xff6961)
    embed.setDescription(error);
    
    channel.send(embed);
  }

  async sendDM(bot, userID, content) {
    try {
      const member = await bot.guild.fetchMember(userID);
  
      const embed = new RichEmbed();
      embed.setColor(0x36393E)
      embed.setDescription(content);
      
      member.send(embed);
    } catch (e) {};
  }

  successMsg (msg, error) {
    const { channel } = msg;
  
    const embed = new RichEmbed();
    embed.setColor(0x77dd77)
    embed.setDescription(error);
    
    channel.send(embed);
  }
}