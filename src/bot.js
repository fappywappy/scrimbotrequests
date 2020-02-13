import { Bot } from 'dismodular';

const settings = (process.env.NODE_ENV === 'development') ? 
  require('./settings/botSettings.dev').default : 
  require('./settings/botSettings').default;

new Bot(__dirname, settings);
