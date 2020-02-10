import { Module } from 'dismodular';

export default class CBKScrims extends Module {
  constructor(bot) {
    super(bot, __dirname);
    if (!this.settings.active) return;
    this.initTeams = require('./functions/initTeams').bind(null, bot);
    this.updateTeams = require('./functions/updateTeams').bind(null, bot);
    this.checkRequests = require('./functions/checkRequests').bind(null, bot);

    this.calculatePoints = require('./functions/calculatePoints').bind(null, bot);
    this.clearRequests = require('./functions/clearRequests').bind(null, bot);
    this.logEvent = require('./functions/logEvent').bind(null, bot);
    this.orderByPoints = require('./functions/orderByPoints').bind(null, bot);
    this.updateTeams = require('./functions/updateTeams').bind(null, bot);

    this.isLocked = false;
    this.inScrim = false;
    this.game1positions = false;
    this.game2positions = false;
    this.game3positions = false;
    this.game1kills = false;
    this.game2kills = false;
    this.game3kills = false;
    this.resultsRecorded = false;

    this._init();
  }

  async _init() {
    // Initiate and update the team panels.
    await this.initTeams();
    await this.updateTeams();

    setInterval(updateTeams, 30000, this);

    // Check requests to see if any of them got deleted.
    this.checkRequests();
  }
}