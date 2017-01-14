import React from 'react';
import TodoList from './todoList.js';
import AddTodo from './addTodo.js';
import Header from './Header';

import { connect } from 'react-redux';

class Main extends React.Component {
    render() {
        return (<div>
            <Header/>
            <TodoList todos={this.props.todos} />
            <AddTodo />
        </div>);
    }
}

function mapStateToProps(todos) {
    return { todos };
}

export default connect(mapStateToProps)(Main);
