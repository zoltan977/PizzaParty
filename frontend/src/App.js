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

import PrivateRoute from './components/Routing/PrivateRoute';
import UnAuthRoute from './components/Routing/UnAuthRoute';

import {connect} from 'react-redux';
import {setData} from './actions/dataActions';
import {loadUser} from './actions/authActions';


const App = ({setData, loadUser}) => {

  useEffect(() => {

      fetch("/api/data")
      .then(r => r.json())
      .then(d => {
        setData(d);
        loadUser();
      })
      .catch(err => {
          console.log(err);
          setData(null);
      })
      .finally(() => {
      });
  
    }, [])
 
  return (
      <div className="App" style={{backgroundImage: 'url("background.svg")', backgroundSize: 'contain'}}>
        <NavBar/>
          <Switch>
            <UnAuthRoute path="/register" component={Register} />
            <UnAuthRoute path="/login" component={Login} />
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
