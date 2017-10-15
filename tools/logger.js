var log4js = require('log4js');
log4js.configure({
    appenders: {
        bilibili2RSS: {
            type: 'file',
            filename: 'logs/bilibili2RSS.log',
            maxLogSize: 20480,
            backups: 3,
            compress: true
        },
        console: {
            type: 'console'
        }
    },
    categories: { default: { appenders: ['bilibili2RSS', 'console'], level: 'INFO' } }
});
var logger = log4js.getLogger('bilibili2RSS');

module.exports = logger;