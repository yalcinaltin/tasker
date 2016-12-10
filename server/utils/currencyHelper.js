/**
 * Created by yalcinaltin on 10.12.2016.
 */
var Currency = require('../models/Currency').Currency;
var LastRate = require('../models/Currency').LastRate;
var crawlers = require('./crawlers');
var mailHelper = require('./mailHelper');

var currencyHelper = (function () {
    let currencyList = {};
    currencyList.USD = () => {
        var url = "http://www.qnbfinansbank.enpara.com/doviz-kur-bilgileri/doviz-altin-kurlari.aspx";
        crawlers.run("USDCurrency", url, (buy, sale) => {
            let value = {buy: buy, sale: sale};
            Currency.findOne({base: 'USD'}, function (err, curr) {
                if (err) throw err;
                if (!curr) {
                    var currency = new Currency({
                        base: "USD",
                        rates: [{rateSymbol: "TRY", values: [value]}]
                    });
                    currency.save(function (err) {
                        if (err) throw err;
                        //TODO socket.io burada kullanıcak
                    });
                } else {
                    curr.rates.forEach((itm) => {
                        if (itm.rateSymbol == "TRY") {
                            itm.values.push(value);
                            curr.save(function (err) {
                                if (err) throw err;
                                //TODO socket.io burada kullanıcak
                            });
                        }
                    });
                }
            });
        });
    };

    let getLastCurrencyRate = (curr, rateSymbol) => {
        var rate = curr.rates.filter((itm) => {
            return itm.rateSymbol == rateSymbol;
        });

        var value = rate[0].values.filter((itm) => {
            return itm.createDate.getTime() == new Date(Math.max.apply(null, rate[0].values.map((e) => {
                    return e.createDate;
                }))).getTime();
        });
        if (value.length)
            return {buy: value[0].buy, sale: value[0].sale, createDate: value[0].createDate}
        return "";
    };
    let getMaxRate = (base, rateSymbol) => {
        return new Promise(function (resolve, reject) {
            Currency.findOne({base: base}, function (err, curr) {
                if (curr) {
                    var rate = curr.rates.filter(function (itm) {
                        return itm.rateSymbol == rateSymbol;
                    });
                    var value = rate[0].values.filter((itm) => {
                        return itm.buy == Math.max.apply(null, rate[0].values.map((e) => {
                                return e.buy;
                            }))
                    });
                    resolve({buy:value[0].buy, sale:value[0].sale});
                }
                else {
                    reject("No Record");
                }
            });
        });
    };
    let getCurrency = (base) => {
        currencyList[base]();
    };
    let lastRate = (base, rateSymbol) => {
        LastRate.findOne({base: base, rateSymbol: rateSymbol})
            .sort({ buy: -1 })
            .exec(function (err, last) {
                if (err) throw err;
                getMaxRate(base, rateSymbol)
                    .then((maxRate)=>{
                        var rate = new LastRate({
                            base: base,
                            rateSymbol: rateSymbol,
                            buy: maxRate.buy,
                            sale: maxRate.sale
                        });
                        if (last) {
                            if (rate.buy - maxRate.buy < 0.5 && rate.buy - maxRate.buy > -0.5)
                                return
                        }
                        rate.save(function (err) {
                            if (err) throw err;
                            //şimdilik mail gönderimi burada olsun
                            //pre'de olabilir tekrar kontrol edilebilir.
                            mailHelper.sendMail();
                        });
                    })
                    .catch(err=>{console.error(new Error(err))});
            });
    };
    return {
        getCurrency: getCurrency,
        lastRate: lastRate
    };
})();

module.exports = currencyHelper;