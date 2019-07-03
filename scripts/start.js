'use strict';

// Makes the script crash on unhandled rejections 
// instead of silently ignoring them.
process.on('unhandledRejection', (r, p) => { throw p; });

require('../src/bot.js');