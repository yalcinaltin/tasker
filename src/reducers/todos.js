// todos reducer
const todos = (state = [], action) => {
    // return index of action's todoList within state
    const todoIndex = () => {
        return state.findIndex(thisTodo => {
            return thisTodo && thisTodo._id === action.todo._id;
        });
    };

    switch(action.type) {
        case 'todo:insert':
            // append todoList at end if not already found in state
            return todoIndex() < 0 ? [...state, action.todo] : state;

        case 'todo:update':
            // Merge props to update todoList if matching id
            var index = todoIndex();
            if (index > -1) {
                var updatedTodo = Object.assign({}, state[index], action.todo);
                return [...state.slice(0, index), updatedTodo, ...state.slice(index + 1)]
            }
            else {
                return state;
            }

        case 'todo:delete':
            // remove matching todoList
            var index = todoIndex();
            if (index > -1) {
                return [...state.slice(0, index), ...state.slice(index + 1)];
            }
            else {
                return state;
            }

        default:
            return state;
    }
};

export default todos;
