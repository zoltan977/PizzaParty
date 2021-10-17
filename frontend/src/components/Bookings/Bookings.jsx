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
    setDirection(!e.target.checked)
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
            <div className="checkboxContainer">
              <input type="checkbox" name="incDec" id="incDec" onChange={changeDirection} />
              <label htmlFor="incDec">
                <svg viewBox="0 0 512 512">
                  <path d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.38-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.77 160 16 160zm416 0H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z">
                  </path>
                </svg>
                <svg viewBox="0 0 512 512">
                  <path d="M240 96h64a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm0 128h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zm256 192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-256-64h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.39-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.78 160 16 160z">
                  </path>
                </svg>
              </label>
            </div>
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
