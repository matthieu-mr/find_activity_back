import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Home from './screens/Home'
import Password from './screens/NewPassword'

function App() {
  return (
    <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/newpassword:id" component={Password} />
    </Switch>
  </Router>
  );
}

export default App;
