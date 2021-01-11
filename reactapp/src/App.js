import React, { PureComponent } from 'react';

import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

// import screen
import MapActivity from './screens/MapActivity'
import MapUser from './screens/MapUser'
 
import Home from './screens/Home'
import Password from './screens/NewPassword'
import ContactScreen from './screens/ContactList'
import modifInformationScreen from './screens/ModifInformations'


// import redux 
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

// import reducers
import userInformation from './reducers/UserInformation'
import listAdressParticipant from './reducers/ListAdressParticipant'
import rdvPointAdress from './reducers/RdvPointAdress'
import ModifInformation from './reducers/ModifInformation'



// import theme
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

const store = createStore(combineReducers({userInformation,listAdressParticipant,rdvPointAdress,ModifInformation}))


function App() {
  return (
    <ThemeProvider theme={theme}>
    <Provider store={store}>
    <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/newpassword:id" component={Password} />
      <Route path="/mapactivity" component={MapActivity} />
      <Route path="/mapuser" component={MapUser} />
      <Route path="/contactlist" component={ContactScreen} />
      <Route path="/modification-informations" component={modifInformationScreen} />

    </Switch>
  </Router>
  </Provider>
  </ThemeProvider>
  );
}


 //export default  withStyles(styles)(app);

export default App;
