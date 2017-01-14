/**
 * Created by yalcinaltin on 12.01.2017.
 */
const Todo = require('../models/Todo');
const controllers = require('../controllers');
const todoHelper = (() => {

    let addTodo = (todo) => {
        var _todo = new Todo(todo);
        _todo.save();
    };
    let updateTodo = (todo) => {
        console.log(todo);
        controllers.io.emitter("todo:update", todo);
        console.log("off");
    };
    let deleteTodo = (todo) => {
        console.log(todo);
    };
    let listTodos = () => {
        return new Promise(function (resolve, reject) {
            Todo.find().lean().exec((err, todos) => {
                if (todos)
                    resolve(todos);
                else
                    reject("Record Not Found");
            });
        });
    };
    return {
        addTodo: addTodo,
        updateTodo: updateTodo,
        deleteTodo: deleteTodo,
        listTodos:listTodos
    }
})
();

module.exports = todoHelper;