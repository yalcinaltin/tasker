import React from 'react';
import { Table, TableBody } from 'material-ui/Table';
import Todo from './Todo.js';

export default class TodoList extends React.Component {
    render() {
        return (<Table>
            <TableBody>
                {this.props.todos.map(todo => <Todo key={todo._id} todo={todo} /> )}
            </TableBody>
        </Table>);
    }
}
