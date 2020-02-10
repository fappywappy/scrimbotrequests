import { Bot } from 'dismodular';

const config = (process.env.NODE_ENV === 'development') ? 
  require('./config/config.dev').default : 
  require('./config/config').default;

new Bot(__dirname, config);
