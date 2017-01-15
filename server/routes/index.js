var express = require('express');
var router = express.Router();
var currencyHelper = require('../utils/currencyHelper');

router.get('/', function (req, res, next) {
    currencyHelper.getLastRate("USD", "TRY").then((data) => {

        res.render('index', {
            title: 'njTasker',
            version: '0.0.1',
            lastBuy: data.buy,
            lastSale: data.sale
        });
    });

});

module.exports = router;
