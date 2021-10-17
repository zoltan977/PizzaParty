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
  const [direction, setDirection] = useState(true);
  const [dateTable, setDateTable] = useState(true);

  const compare = (incDec = true, dateOrTable = true, recCall = false) => (b1, b2) => {
    const start1 = dateOrTable ? new Date(b1.start) : Number(b1.tableNumber)
    const start2 = dateOrTable ? new Date(b2.start) : Number(b2.tableNumber)
    
    if (start1 < start2)
      return incDec ? -1 : 1;

    if (start2 < start1)
      return incDec ? 1 : -1;
    
    if (start1 === start2) {
      if (!recCall)
        return compare(incDec, !dateOrTable, true)(b1, b2);
      else
        return 0;
    }

  }

  const changeDirection = e => {
    setDirection(e.target.value)
  }

  const changeDateOrTable = e => {
    setDateTable(e.target.value)
  }

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
          <div className="dashboard">
            <select name="dateOrTable" id="dateOrTable" onChange={changeDateOrTable}>
              <option value="1">dátum</option>
              <option value="">asztal</option>
            </select>
            <select name="incDec" id="incDec" onChange={changeDirection}>
              <option value="1">növekvő</option>
              <option value="">csökkenő</option>
            </select>
          </div>
          <div className="content">
            {userBookings.length ? (
              userBookings.sort(compare(direction, dateTable)).map((u, i) => (
                <BookingCard
                  key={i}
                  tableNumber={u.tableNumber}
                  start={u.start}
                  end={u.end}
                />
              ))
            ) : (
              <p className="info">Nincsenek asztalfoglalások!</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default connect(null, { logout })(Bookings);
