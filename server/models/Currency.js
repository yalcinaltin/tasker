/**
 * Created by yalcinaltin on 8.12.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//hepsi ayrı ayrı tablo birleştirmelimi olsun bu şekil mi
// dez avantaj 1 kayıt getirmek isterken bütün rateler geliyor
//ya da ben bilmiyorum

const value = new Schema({
    buy: Number,
    sale: Number,
    createDate: {type: Date, default: Date.now},
    _id: false,
    id: false
});
const rates = new Schema({
    rateSymbol: String,
    values: [value],
    createDate: {type: Date, default: Date.now},
    _id: false,
    id: false
});

const currencySchema = new Schema({
    base: String,
    rates: [rates],
    createDate: Date,
    updateDate: Date
});
const lastRateSchema = new Schema({
    base: String,
    rateSymbol: String,
    buy: Number,
    sale: Number,
    createDate: { type: Date, default: Date.now }
});
currencySchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updateDate = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createDate)
        this.createDate = currentDate;

    next();
});
currencySchema.pre('update', function () {
    this.updateDate = new Date();
});

var Currency = mongoose.model('Currency', currencySchema);
var LastRate = mongoose.model('LastRate',lastRateSchema);

module.exports = {
    Currency: Currency,
    LastRate: LastRate
};