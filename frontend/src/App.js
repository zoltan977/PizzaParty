import "./App.css";
import React, { useEffect } from "react";

import { Redirect, Route, Switch } from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Order from "./components/Order/Order";
import Orders from "./components/Orders/Orders";
import Callback from "./components/Callback/Callback";
import Confirm from "./components/Confirm/Confirm";
import PasswordReset from "./components/PasswordReset/PasswordReset";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import LoadingMask from "./components/LoadingMask/LoadingMask.component";
import Booking from "./components/Booking/Booking";
import Bookings from "./components/Bookings/Bookings";

import PrivateRoute from "./components/Routing/PrivateRoute";
import UnAuthRoute from "./components/Routing/UnAuthRoute";

import { connect } from "react-redux";
import { setData } from "./actions/dataActions";
import { loadUser } from "./actions/authActions";

import { useLocation } from "react-router-dom";
import Profile from "./components/Profile/Profile";

const App = ({ loadingData, setData, loadUser }) => {
  const location = useLocation();

  useEffect(() => {
    console.log("app.js location.pathname: ", location.pathname);

    setData();

    if (location.pathname !== "/confirm" && location.pathname !== "/callback")
      loadUser();
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundImage: 'url("background.svg")',
        backgroundSize: "contain",
      }}
    >
      <NavBar />
      <Switch>
        <UnAuthRoute path="/register" component={Register} />
        <UnAuthRoute path="/login" component={Login} />
        <PrivateRoute path="/order" component={Order} />
        <PrivateRoute path="/orders" component={Orders} />
        <PrivateRoute path="/booking" component={Booking} />
        <PrivateRoute path="/bookings" component={Bookings} />
        <PrivateRoute path="/profile" component={Profile} />
        <Route path="/confirm" component={Confirm} />
        <Route path="/callback" component={Callback} />
        <Route path="/password_reset" component={PasswordReset} />
        <Route path="/forgot_password" component={ForgotPassword} />
        <Route path="/cart">{loadingData ? <LoadingMask /> : <Cart />}</Route>
        <Route exact path="/">
          {loadingData ? <LoadingMask /> : <Home />}
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loadingData: state.data.loading,
});

export default connect(mapStateToProps, { setData, loadUser })(App);
