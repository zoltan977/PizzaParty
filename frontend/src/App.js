import './App.css';
import React, { useEffect } from 'react'

import { Redirect, Route, Switch } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Order from './components/Order/Order';
import Orders from './components/Orders/Orders';
import Callback from './components/Callback/Callback';
import Confirm from './components/Confirm/Confirm';

import PrivateRoute from './components/Routing/PrivateRoute';
import UnAuthRoute from './components/Routing/UnAuthRoute';

import {connect} from 'react-redux';
import {setData} from './actions/dataActions';
import {loadUser} from './actions/authActions';

import { useLocation } from 'react-router-dom'

const App = ({setData, loadUser}) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("app.js location.pathname: ", location.pathname);

    setData();

    if (location.pathname !== "/confirm")
      loadUser();
      
  }, [])
 
  return (
      <div className="App" style={{backgroundImage: 'url("background.svg")', backgroundSize: 'contain'}}>
        <NavBar/>
          <Switch>
            <UnAuthRoute path="/register" component={Register} />
            <UnAuthRoute path="/login" component={Login} />
            <Route path="/confirm" component={Confirm} />
            <Route path="/callback" component={Callback} />
            <PrivateRoute path="/order" component={Order} />
            <PrivateRoute path="/orders" component={Orders} />
            <Route path="/cart" component={Cart} />
            <Route exact path="/" component={Home} />
            <Redirect to="/" />
          </Switch>
      </div>
  );
}

export default connect(null, {setData, loadUser})(App)
