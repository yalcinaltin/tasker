var server = require('./server');
var io = require('socket.io')(server);
var r = require('rethinkdb');

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

// Socket.io changefeed events
var changefeedSocketEvents = require('./socket-events.js');
r.connect({ db: '3RES_Todo' })
    .then(function(connection) {
        io.on('connection', function (socket) {
            // insert new todos
            socket.on('todo:client:insert', function(todo) {
                r.table('Todo').insert(todo).run(connection);
            });
            // update todo
            socket.on('todo:client:update', function(todo) {
                var id = todo.id;
                delete todo.id;
                r.table('Todo').get(id).update(todo).run(connection);
            });
            // delete todo
            socket.on('todo:client:delete', function(todo) {
                var id = todo.id;
                delete todo.id;
                r.table('Todo').get(id).delete().run(connection);
            });
            // emit events for changes to todos
            r.table('Todo').changes({ includeInitial: true, squash: true }).run(connection)
                .then(changefeedSocketEvents(socket, 'todo'));
        });
    })
    .error(function(error) {
        console.log('Error connecting to RethinkDB!');
        console.log(error);
    });