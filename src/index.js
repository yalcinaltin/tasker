import React from 'react';
import ReactDOM from 'react-dom';

import Header from 'components/Header';

// Material-UI theme stuff
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Needed for Material-UI
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


// Render our react app!
ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Header />
    </MuiThemeProvider>
, document.getElementById('main'));