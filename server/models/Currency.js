/**
 * Created by yalcinaltin on 8.12.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const rateSchema = new Schema({
    rateSymbol: String,
    buy: Number,
    sale: Number,
    createDate: { type: Date, default: Date.now }
}, { versionKey: false });

const currencySchema = new Schema({
    base: String,
    rates: [{ type: Schema.Types.ObjectId, ref: 'Rate' }],
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
}, { versionKey: false });

const lastRateSchema = new Schema({
    base: String,
    rateSymbol: String,
    buy: Number,
    sale: Number,
    createDate: { type: Date, default: Date.now }
}, { versionKey: false });

currencySchema.pre('save', function (next) {
    next();
});
currencySchema.pre('update', function (next) {
    this.updateDate = new Date();
    next();
});



var Rate = mongoose.model('Rate', rateSchema);
var Currency = mongoose.model('Currency', currencySchema);
var LastRate = mongoose.model('LastRate', lastRateSchema);

module.exports = {
    Currency: Currency,
    LastRate: LastRate,
    Rate:Rate
};