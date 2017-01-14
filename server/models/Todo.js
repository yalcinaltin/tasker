/**
 * Created by yalcinaltin on 12.01.2017.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    completed: { type: Boolean, default:false },
    name : String,
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
}, { versionKey: false });

todoSchema.pre('update', function (next) {
    this.updateDate = new Date();
    next();
});

var Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;