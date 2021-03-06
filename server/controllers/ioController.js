/**
 * Created by yalcinaltin on 12.01.2017.
 */
var socketio = require('socket.io');
var events = require('events');
var eventEmitter = new events.EventEmitter();

module.exports.emitter = function (selector, data) {
    eventEmitter.emit('socket',selector,data);
};

module.exports.listen = function (server) {
    io = socketio.listen(server);
    const todoHelper = require('../utils/todoHelper');
    io.on('connection', function (socket) {

        eventEmitter.on('socket', (selector, data) => {
                socket.emit(selector, data);
            }
        );
        // insert new todos
        socket.on('todo:client:insert', function (todo) {
            todoHelper.addTodo(todo);
        });
        // update todoList
        socket.on('todo:client:update', function (todo) {
            todoHelper.updateTodo(todo);
        });
        // delete todoList
        socket.on('todo:client:delete', function (todo) {
            todoHelper.deleteTodo(todo);
        });
        var sentMydata = false;
        if (!sentMydata) {
            todoHelper.listTodos();
            sentMydata = true;
        }
    });
    return io;
};