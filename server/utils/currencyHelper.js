/**
 * Created by yalcinaltin on 10.12.2016.
 */
const Currency = require('../models/Currency').Currency;
const LastRate = require('../models/Currency').LastRate;
const Rate = require('../models/Currency').Rate;
const crawlers = require('./crawlers');
const mailHelper = require('./mailHelper');
const controllers = require('../controllers');

var currencyHelper = (function () {
    let currencyList = {};
    currencyList.USD = () => {
        var url = "http://www.qnbfinansbank.enpara.com/doviz-kur-bilgileri/doviz-altin-kurlari.aspx";
        crawlers.run("USDCurrency", url, (buy, sale) => {
            Currency.findOne({base: 'USD'}, function (err, curr) {
                if (err) throw err;
                if (!curr) {
                    var currency = new Currency({
                        base: "USD",
                    });
                    var rate = new Rate({rateSymbol: "TRY", buy: buy, sale: sale});
                    rate.save();
                    currency.rates.push(rate);
                    currency.save(function (err) {
                        if (err) throw err;
                        //TODO socket.io burada kullanıcak
                    });
                } else {
                    var rate = new Rate({rateSymbol: "TRY", buy: buy, sale: sale});
                    rate.save();
                    curr.rates.push(rate);
                    curr.save(function (err) {
                        if (err) throw err;

                        let data ={
                            lastBuy: buy,
                            lastSale: sale
                        };
                        controllers.io.emitter("currencyChange", data);
                    });
                }
            });
        });
    };
    let getMaxRate = (base, rateSymbol) => {
        return new Promise(function (resolve, reject) {
            Currency.findOne({base: base})
                .populate({
                    path: "rates",
                    match: {"rateSymbol": rateSymbol},
                    select: 'buy sale',
                    options: {sort: "-buy", limit: 1}
                }).lean()
                .exec(function (err, curr) {
                    if (curr)
                        resolve({buy: curr.rates[0].buy, sale: curr.rates[0].sale});
                    else
                        reject("Record Not Found");
                });
        });
    };
    let getLastRate = (base, rateSymbol) => {
        return new Promise(function (resolve, reject) {
            Currency.findOne({base: base})
                .populate({
                    path: "rates",
                    match: {"rateSymbol": rateSymbol},
                    select: 'buy sale',
                    options: {sort: "-createDate", limit: 1}
                }).lean()
                .exec(function (err, curr) {
                    if (curr)
                        resolve({buy: curr.rates[0].buy, sale: curr.rates[0].sale});
                    else
                        reject("Record Not Found");
                });
        });
    };

    let getCurrency = (base) => {
        currencyList[base]();
    };
    let lastRate = (base, rateSymbol, downValue, upValue) => {
        LastRate.findOne({base: base, rateSymbol: rateSymbol})
            .sort({createDate: -1})
            .lean()
            .exec(function (err, last) {
                if (err) throw err;
                getLastRate(base, rateSymbol)
                    .then((maxRate) => {
                        var rate = new LastRate({
                            base: base,
                            rateSymbol: rateSymbol,
                            buy: maxRate.buy,
                            sale: maxRate.sale
                        });
                        let oldBuy;
                        let oldSale;
                        let sendMessage = true;
                        if (last) {
                            if (last.buy - maxRate.buy < upValue && last.buy - maxRate.buy > downValue)
                                sendMessage = false;
                            oldBuy = last.buy;
                            oldSale = last.sale;
                        } else {
                            oldBuy = maxRate.buy;
                            oldSale = maxRate.sale;
                        }
                        let data = {
                            oldBuy: oldBuy,
                            oldSale: oldSale,
                            newBuy: maxRate.buy,
                            newSale: maxRate.sale
                        };
                        if (sendMessage)
                            rate.save(function (err) {
                                if (err) throw err;
                                //şimdilik mail gönderimi burada olsun
                                //pre'de olabilir tekrar kontrol edilebilir.
                                mailHelper.sendMail('USD', data);
                            });
                    })
                    .catch(err => {
                        console.error(new Error(err))
                    });
            });
    };
    return {
        getCurrency: getCurrency,
        lastRate: lastRate
    };
})();

module.exports = currencyHelper;