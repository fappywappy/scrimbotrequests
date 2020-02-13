import { Module } from 'dismodular';
import { initializeTeams, updateTeams, checkRequests, setMemberVariables } from './functions';
import moduleSettings from './settings/moduleSettings';

const userSettings = (process.env.NODE_ENV === 'development') ? 
  require('./settings/userSettings.dev').default : 
  require('./settings/userSettings').default;

export default class CBKScrims extends Module {  
  constructor(bot) {
    super(bot, __dirname);
    this.moduleSettings = moduleSettings;
    this.userSettings = userSettings;
    
    if (!this.userSettings.enabled) return;

    this._initialize();
  }

  async _initialize() {
    await setMemberVariables(this);
    await initializeTeams(this);
    await updateTeams(this);
    
    setInterval(checkRequests, 15000, this);
    setInterval(updateTeams, 30000, this);
  }
}