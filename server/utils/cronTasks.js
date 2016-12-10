/**
 * Created by yalcinaltin on 8.12.2016.
 */
var CronJob = require('cron').CronJob;
var currencyHelper = require('./currencyHelper');

var cronTasks = (function () {
    let currencyCheck = (base) => {
        var currencyJob = new CronJob('*/10 * * * * *',function () {
            //currencyHelper.getCurrency(base);
            currencyHelper.lastRate("USD","TRY");
        },null,true);
        return currencyJob;
    };
    let currencyControl = () => {
    };
    let start = () => {
        currencyCheck("USD").start();
    };
    return {
        start: start
    }
})();

module.exports = cronTasks;