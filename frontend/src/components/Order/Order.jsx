import "../Login/Login.css";
import React, { useState } from "react";
import httpClient from "axios";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
import LoadingMask from "../LoadingMask/LoadingMask.component";

const Order = ({ logout, cart, history }) => {
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

      const res = await httpClient.post("/api/order", { ...order, cart }, config);

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
});

export default connect(mapStateToProps, { logout })(Order);
