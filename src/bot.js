import Bot from './structures/Bot';
const config = (process.env.NODE_ENV === 'development' ? require('./config/config.dev') : require('./config/config')).default;

new Bot(__dirname, config);
