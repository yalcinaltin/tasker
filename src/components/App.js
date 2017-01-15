import React from 'react';
import TodoList from './TodoList.js';
import AddTodo from './AddTodo.js';
import Header from './Header';;
import SnackBar from './SnackBar';

import { connect } from 'react-redux';

class Main extends React.Component {
    render() {
        return (<div>
            <Header/>
            <TodoList todos={this.props.todos} />
            <AddTodo />
            <SnackBar msg="test"/>
        </div>);
    }
}

function mapStateToProps(todos) {
    return { todos };
}

export default connect(mapStateToProps)(Main);
