import "../Login/Login.css";
import React, { useState } from "react";
import httpClient from "axios";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
import LoadingMask from "../LoadingMask/LoadingMask.component";
import { Link } from "react-router-dom";
import sumCart from "../../utils/sumCart";

const Order = ({ logout, cart, data, history }) => {
  let formValid = true;

  const [order, setOrder] = useState({
    name: "",
    email: "",
    tel: "",
    address: "",
  });

  const [error, setError] = useState(null);

  const [waitingForServer, setWaitingForServer] = useState(false);

  const { name, email, tel, address } = order;

  const onChange = (e) =>
    setOrder({ ...order, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!formValid) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      setError(null);
      setWaitingForServer(true);

      const res = await httpClient.post(
        "/api/order",
        { ...order, cart },
        config
      );

      setWaitingForServer(false);

      if (res.data && res.data.success === true) history.push("/orders");
      else logout();
    } catch (err) {
      console.log("order error: ", err.response.data);
      setWaitingForServer(false);
      setError(err.response.data);
      if (
        err.response.data.msg &&
        err.response.data.msg.includes("Authentication error")
      )
        logout();
    }
  };

  return (
    <div className="Order">
      {waitingForServer ? (
        <LoadingMask />
      ) : (
        <div className="content">
          <h1>Új megrendelés</h1>
          <div className="alerts">
            {(function () {
              let alerts = [];
              formValid = true;

              if (name === "" || email === "" || tel === "" || address === "") {
                alerts.push(
                  <p key={alerts.length + 1}>Tölts ki minden mezőt!</p>
                );
                formValid = false;
              }

              if (
                !Object.keys(cart.pizza).length &&
                !Object.keys(cart.topping).length
              ) {
                alerts.push(<p key={alerts.length + 1}>A kosár üres!</p>);
                formValid = false;
              }

              if (error) {
                if (error.msg)
                  alerts.push(<p key={alerts.length + 1}>{error.msg}</p>);

                if (error.errors) {
                  for (const err of error.errors) {
                    alerts.push(<p key={alerts.length + 1}>{err.msg}</p>);
                  }
                }
              }

              return alerts;
            })()}
          </div>
          <form>
            <div>
              <label htmlFor="name">Név</label>
              <input
                type="text"
                name="name"
                placeholder="név"
                value={name}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@mail.hu"
                value={email}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="tel">Telefon</label>
              <input
                type="tel"
                name="tel"
                placeholder="06201234567"
                value={tel}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="address">Cím</label>
              <input
                type="text"
                name="address"
                placeholder="1234 Város, Utca név 1"
                value={address}
                onChange={onChange}
              />
            </div>
            <div className="cart">
              <Link to="/cart">
                <svg id="cart" viewBox="0 0 576 512">
                  <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path>
                </svg>
                <span>
                  Összeg: {sumCart(cart, data)} Ft
                </span>
              </Link>
            </div>
            <button type="button" disabled={!formValid} onClick={submit}>
              Küldés
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  data: state.data.data
});

export default connect(mapStateToProps, { logout })(Order);
