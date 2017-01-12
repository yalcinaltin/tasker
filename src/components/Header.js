import React, { Component } from 'react'
import { Drawer, AppBar, MenuItem} from 'material-ui'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { Route, Router } from 'react-router'



export default class Header extends Component  {

    constructor(props){
        super(props);
        this.state = {open:false};
        this.handleToggle = this.handleToggle.bind(this)
    }

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    }

    handleToggle() {
        this.setState({open: !this.state.open});
    }
    handleClose() { this.setState({open: false}); }
    render() {
        return (
            <div>
                <Drawer
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    <MenuItem onTouchTap={this.handleClose}>Buralar hep dolacak</MenuItem>
                </Drawer>

                <AppBar
                    title="App Bar Example"
                    onLeftIconButtonTouchTap={this.handleToggle}/>
            </div>
        );
    }
}

Header.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};