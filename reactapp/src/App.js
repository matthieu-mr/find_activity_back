import React, { PureComponent } from 'react';

import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Home from './screens/Home'
import Password from './screens/NewPassword'

// import redux 
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

// import reducers
import userInformation from './reducers/UserInformation'
import listAdressParticipant from './reducers/ListAdressParticipant'

import MapUser from './screens/Map'
import listTest from './screens/ListTest'
import { ThemeProvider } from '@material-ui/core/styles';

import theme from './theme';

const store = createStore(combineReducers({userInformation,listAdressParticipant}))


function App() {
  return (
    <ThemeProvider theme={theme}>
    <Provider store={store}>
    <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/newpassword:id" component={Password} />
      <Route path="/carte" component={MapUser} />
      <Route path="/list" component={listTest} />
    </Switch>
  </Router>
  </Provider>
  </ThemeProvider>
  );
}


 //export default  withStyles(styles)(app);

export default App;
