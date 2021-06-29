import './App.css';

import { useEffect, useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import DataContext from './context/data/dataContext';

import NavBar from './components/NavBar/NavBar';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import AuthContext from './context/auth/authContext';
import Order from './components/Order/Order';
import Orders from './components/Orders/Orders';
import PrivateRoute from './components/Routing/PrivateRoute';
import UnAuthRoute from './components/Routing/UnAuthRoute';

function App() {

  const {setData} = useContext(DataContext)
  const {loadUser} = useContext(AuthContext)

  useEffect(() => {

    fetch("http://localhost:8000/api/data")
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
            <Route path="/cart" component={Cart} />
            <PrivateRoute path="/order" component={Order} />
            <PrivateRoute path="/orders" component={Orders} />
            <Route exact path="/" component={Home} />
            <Redirect to="/" />
          </Switch>
      </div>
  );
}

export default App;
