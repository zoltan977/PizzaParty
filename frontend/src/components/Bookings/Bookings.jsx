import "./Bookings.css";
import React, { useState, useEffect } from "react";
import httpClient from "axios";
import BookingCard from "./BookingCard/BookingCard";
import LoadingMask from "../LoadingMask/LoadingMask.component";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";

const Bookings = ({ logout }) => {
  const [userBookings, setUserBookings] = useState([]);
  const [waitingForServer, setWaitingForServer] = useState(false);

  useEffect(() => {
    const asyncFn = async () => {
      try {
        setWaitingForServer(true);
        const resp = await httpClient.get("/api/user_bookings");
        setWaitingForServer(false);

        setUserBookings(resp.data.userBookingsArray);
        console.log("user bookings: ", resp.data);
      } catch (error) {
        setWaitingForServer(false);
        console.log("user bookings error: ", error);
        logout();
      }
    };

    asyncFn();
  }, []);

  return (
    <div className="UserBookings">
      {waitingForServer ? (
        <LoadingMask />
      ) : (
        <>
          <div className="title">
            <h1>Asztalfoglalások</h1>
          </div>
          <div className="content">
            {userBookings.length ? userBookings.map((u, i) => (
              <BookingCard
                key={i}
                tableNumber={u.tableNumber}
                start={u.start}
                end={u.end}
              />
            )) : <p className="info">Nincsenek asztalfoglalások!</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default connect(null, { logout })(Bookings);
