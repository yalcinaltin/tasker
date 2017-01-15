import React, { Component } from 'react'
import { Drawer, AppBar, MenuItem} from 'material-ui'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { Route, Router } from 'react-router'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

// Import socket and connect
import io from 'socket.io-client';
const socket = io.connect('/');

export default class Header extends Component  {

    constructor(props){
        super(props);
        var data = JSON.parse(document.getElementById("currency").textContent);
        this.state = {
            open:false,
            lastBuy:data.lastBuy,
            lastSale:data.lastSale
        };
        this.handleToggle = this.handleToggle.bind(this);

        var $this = this;
        socket.on('currencyChange', function (state) {
            $this.setState({
                lastBuy:state.lastBuy,
                lastSale:state.lastSale
            });
        });
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
                    <List className="currContainer">
                        <Subheader>Last Rate</Subheader>
                        <ListItem
                            primaryText="Alış"
                            secondaryText={this.state.lastBuy}
                            rightIcon={<i className="fa fa-usd"/>}
                        />
                        <ListItem
                            primaryText="Satış"
                            secondaryText={this.state.lastSale}
                            rightIcon={<i className="fa fa-usd"/>}
                        />
                    </List>
                </Drawer>

                <AppBar
                    title="njTasker"
                    onLeftIconButtonTouchTap={this.handleToggle}/>
            </div>
        );
    }
}

Header.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};