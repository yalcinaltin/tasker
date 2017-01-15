/**
 * Created by yalcinaltin on 12.01.2017.
 */
const Todo = require('../models/Todo');
const controllers = require('../controllers');
const todoHelper = (() => {

    let addTodo = (todo) => {
        var _todo = new Todo(todo);
        _todo.save(function (err) {
            if (err) throw err;
            controllers.io.emitter("todo:insert", _todo);

            controllers.io.emitter('changeState', {
                changeState: true,
                msg: "Kayıt eklendi"
            });
        });
    };
    let updateTodo = (todo) => {
        Todo.findOne({_id: todo._id}, function (err, _todo) {
            _todo.completed = todo.completed;
            _todo.save(function (err) {
                if (err) throw err;
                controllers.io.emitter("todo:update", todo);

                controllers.io.emitter('changeState', {
                    changeState: true,
                    msg: "Kayıt güncellendi"
                });
            });
        });
    };
    let deleteTodo = (todo) => {
        Todo.find({_id: todo._id}).remove().exec(
            function (err) {
                if (err) throw err;
                controllers.io.emitter("todo:delete", todo);

                controllers.io.emitter('changeState', {
                    changeState: true,
                    msg: "Kayıt silindi"
                });
            }
        );
    };
    let listTodos = () => {
        Todo.find().lean().exec((err, todos) => {
            todos.map(todo => {
                controllers.io.emitter("todo:insert", todo);
            });
        });
    };
    return {
        addTodo: addTodo,
        updateTodo: updateTodo,
        deleteTodo: deleteTodo,
        listTodos: listTodos
    }
})
();

module.exports = todoHelper;