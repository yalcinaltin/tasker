/**
 * Created by yalcinaltin on 10.12.2016.
 */
var Currency = require('../models/Currency').Currency;
var LastRate = require('../models/Currency').LastRate;
var Rate = require('../models/Currency').Rate;
var crawlers = require('./crawlers');
var mailHelper = require('./mailHelper');

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
                        //TODO socket.io burada kullanıcak
                    });
                }
            });
        });
    };
    let getMaxRate = (base, rateSymbol) => {
        return new Promise(function (resolve, reject) {
            Currency.findOne({base: "USD"})
                .populate({
                    path: "rates",
                    match: {"rateSymbol": "TRY"},
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

    let getCurrency = (base) => {
        currencyList[base]();
    };
    let lastRate = (base, rateSymbol, downValue, upValue) => {
        LastRate.findOne({base: base, rateSymbol: rateSymbol})
            .sort({buy: -1})
            .exec(function (err, last) {
                if (err) throw err;
                getMaxRate(base, rateSymbol)
                    .then((maxRate) => {
                        var rate = new LastRate({
                            base: base,
                            rateSymbol: rateSymbol,
                            buy: maxRate.buy,
                            sale: maxRate.sale
                        });
                        let oldBuy;
                        let oldSale;
                        if (last) {
                            if (last.buy - maxRate.buy < upValue && last.buy - maxRate.buy > downValue)
                                return
                            oldBuy = last.buy;
                            oldSale = last.buy;
                        } else {
                            oldBuy = maxRate.buy;
                            oldSale = maxRate.sale;
                        }
                        rate.save(function (err) {
                            if (err) throw err;
                            //şimdilik mail gönderimi burada olsun
                            //pre'de olabilir tekrar kontrol edilebilir.
                            let data = {
                                oldBuy: oldBuy,
                                oldSale: oldSale,
                                newBuy: maxRate.buy,
                                newSale: maxRate.sale
                            };
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