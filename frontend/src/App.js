import './App.css';

import { Redirect, Route, Switch } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Order from './components/Order/Order';
import Orders from './components/Orders/Orders';
import PrivateRoute from './components/Routing/PrivateRoute';
import UnAuthRoute from './components/Routing/UnAuthRoute';

import {Provider} from 'react-redux';
import store from './store';


const App = () => {
 
  return (
    <Provider store={store}>
      <div className="App" style={{backgroundImage: 'url("background.svg")', backgroundSize: 'contain'}}>
        <NavBar/>
          <Switch>
            <UnAuthRoute path="/register" component={Register} />
            <UnAuthRoute path="/login" component={Login} />
            <PrivateRoute path="/order" component={Order} />
            <PrivateRoute path="/orders" component={Orders} />
            <Route path="/cart" component={Cart} />
            <Route exact path="/" component={Home} />
            <Redirect to="/" />
          </Switch>
      </div>
    </Provider>
  );
}

export default App;
