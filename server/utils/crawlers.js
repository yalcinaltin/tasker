/**
 * Created by yalcinaltin on 8.12.2016.
 */
var request = require('request');
var cheerio = require('cheerio');

var crawlers = (function () {
    let crawlerList = {};
    crawlerList.USDCurrency = (url, callback) => {
        request(url, function (error, response, html) {
            if (!error) {
                if (response.statusCode === 200) {
                    var $ = cheerio.load(html);
                    var _USD = $($('#pnlContent .dlContspan')[0]).parents("dl").find("dd span");

                    let buy = parseFloat($(_USD[0]).text().replace(/ TL/, "").replace(/,/, "."));
                    let sale = parseFloat($(_USD[1]).text().replace(/ TL/, "").replace(/,/, "."));
                    callback(buy, sale);
                }
            }
        });
    };

    let run = (crawler, url, callback) => {
        crawlerList[crawler](url, callback);
    };
    return {
        run: run
    }
})();


module.exports = crawlers;