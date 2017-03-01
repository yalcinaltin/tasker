var express = require('express');
var router = express.Router();
var currencyHelper = require('../utils/currencyHelper');

router.get('/', function (req, res, next) {
    currencyHelper.getLastRate("USD", "TRY").then((data) => {
        res.setHeader('Cache-Control', 'public, max-age=31557600');
        res.render('index', {
            title: 'njTasker',
            version: '0.0.11',
            lastBuy: data.buy,
            lastSale: data.sale
        });
    });

});

module.exports = router;
