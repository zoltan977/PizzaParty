import "./Orders.css";
import React, { useEffect, useState } from "react";
import httpClient from "axios";
import OrderCard from "./OrderCard/OrderCard";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
import LoadingMask from "../LoadingMask/LoadingMask.component";

const Orders = ({ logout }) => {
  const [orders, setOrders] = useState([]);
  const [waitingForServer, setWaitingForServer] = useState(false);

  useEffect(() => {
    const asyncFn = async () => {
      try {
        setWaitingForServer(true);
        const res = await httpClient.get("/api/orders");
        setWaitingForServer(false);

        console.log("orders: ", res.data);
        setOrders(res.data);
      } catch (err) {
        setWaitingForServer(false);

        console.log(err.response.data);
        logout();
      }
    };

    asyncFn();
  }, []);

  return (
    <div className="Orders">
      {waitingForServer ? (
        <LoadingMask />
      ) : (
        <>
          <div className="title">
            <h1>Megrendelések</h1>
          </div>
          <div className="content">
            {orders.length ? (
              orders.map((ord, idx) => <OrderCard key={idx} order={ord} />)
            ) : (
              <p className="info">Nincsenek megrendelések</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default connect(null, { logout })(Orders);
