/**
 * Created by yalcinaltin on 15.01.2017.
 */
import React from 'react';
import Snackbar from 'material-ui/Snackbar';
// Import socket and connect
import io from 'socket.io-client';
const socket = io.connect('/');

export default class SnackBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            msg: ""
        };
        var $this = this;
        socket.on('changeState', function (state) {
            $this.setState({
                open: state.changeState,
                msg: state.msg
            });
        });
    };

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        return (
            <Snackbar
                open={this.state.open}
                message={this.state.msg}
                autoHideDuration={4000}
                onRequestClose={this.handleRequestClose}
            />
        );
    }
}