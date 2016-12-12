/**
 * Created by yalcinaltin on 8.12.2016.
 */
var CronJob = require('cron').CronJob;
var currencyHelper = require('./currencyHelper');

var cronTasks = (function () {
    let currencyCheck = (base) => {
        var checkJob = new CronJob('00 */2 9-17 * * 1-5',function () {
            currencyHelper.getCurrency(base);
        },null,true);
        return checkJob;
    };
    let currencyControl = (base,rateSymbol) => {
        var controlJob = new CronJob('00 */2 9-17 * * 1-5',function () {
            currencyHelper.lastRate(base,rateSymbol);
        },null,true);
        return controlJob;
    };
    let start = () => {
        currencyCheck("USD").start();
        currencyControl("USD","TRY").start();
    };
    return {
        start: start
    }
})();

module.exports = cronTasks;