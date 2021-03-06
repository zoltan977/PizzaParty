import "./Booking.css";
import React, { useEffect, useState } from "react";
import httpClient from "axios";
import LoadingMask from "../LoadingMask/LoadingMask.component";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
import DateBooking from "./DateBooking/DateBooking";
import Dashboard from "./Dashboard/Dashboard";
import BookingTable from "./BookingTable/BookingTable";
import BookingContext from "./BookingContext/BookingContext";

const Booking = ({ logout }) => {
  const days = [
    "Vasárnap",
    "Hétfő",
    "Kedd",
    "Szerda",
    "Csütörtök",
    "Péntek",
    "Szombat",
  ];

  const [dateStrings, setDateStrings] = useState([]);
  const [firstDayIndex, setFirstDayIndex] = useState(0);
  const [selectedTableNumber, setSelectedTableNumber] = useState(0);
  const [bookings, setBookings] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [waitingForServer, setWaitingForServer] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const createDateStrings = () => {
    const dateStringArray = [];

    for (let day = 1; day <= 7; day++) {
      //offset in milliseconds
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      const futureTimeStamp = Date.now() + day * 24 * 60 * 60 * 1000;

      const aDayInTheFuture = new Date(futureTimeStamp - tzoffset)
        .toISOString()
        .slice(0, 10);

      dateStringArray.push(aDayInTheFuture);

      if (day === 1) setFirstDayIndex(new Date(futureTimeStamp).getDay());
    }

    setDateStrings(dateStringArray);
  };

  //automatically add properties to an object which were undefined
  //and gives it a value
  const addProps = (obj, arr, val) => {
    if (typeof arr == "string") arr = arr.split(".");

    obj[arr[0]] = obj[arr[0]] || {};

    const tmpObj = obj[arr[0]];

    if (arr.length > 1) {
      arr.shift();
      addProps(tmpObj, arr, val);
    } else obj[arr[0]] = val;

    return obj;
  };

  //Updates the booking state based on the given values
  //and checking for pending changes
  //Booking state is in the form: {tableNumber: {date : {interval: (<user email> || <true> || "x")}}}
  //where "x" denotes a new booking of the authenticated user
  //<user email> denotes a previous booking of the authenticated user
  //<true> denotes a booking of an other user
  const changeBookingState = (value, day, quarterHour) => {
    const copyOfBookings = { ...bookings };
    if (!value) delete copyOfBookings[selectedTableNumber][day][quarterHour];
    else
      addProps(copyOfBookings, [selectedTableNumber, day, quarterHour], value);

    let changes = false;
    for (const tableNumber in copyOfBookings) {
      if (!Object.keys(copyOfBookings[tableNumber]).length) {
        delete copyOfBookings[tableNumber];
        continue;
      }
      for (const date in copyOfBookings[tableNumber]) {
        if (!Object.keys(copyOfBookings[tableNumber][date]).length) {
          delete copyOfBookings[tableNumber][date];
          continue;
        }
        for (const interval in copyOfBookings[tableNumber][date]) {
          if (copyOfBookings[tableNumber][date][interval] === "x")
            changes = true;
        }
      }
    }

    setUnsavedChanges(changes);
    setBookings(copyOfBookings);
  };

  //Modifies the interval number and date based on timezone
  //(interval and date shifting routine)
  const intervalCorrectionBasedOnTimeZone = (
    intervalNumber,
    intervalDate,
    outgoingData
  ) => {
    //Timezone offset in quarter hours
    const tzoffset = Math.round(new Date().getTimezoneOffset() / 15);

    let correctedIntervalNumber = intervalNumber;

    if (outgoingData) correctedIntervalNumber = intervalNumber + tzoffset;
    else correctedIntervalNumber = intervalNumber - tzoffset;

    let correctedDate = intervalDate;

    if (correctedIntervalNumber < 0) {
      correctedDate = new Date(
        new Date(intervalDate).getTime() - 1 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10);
      correctedIntervalNumber = 96 + correctedIntervalNumber;
    } else if (correctedIntervalNumber > 95) {
      correctedDate = new Date(
        new Date(intervalDate).getTime() + 1 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10);
      correctedIntervalNumber = correctedIntervalNumber - 96;
    }

    return [correctedDate, correctedIntervalNumber];
  };

  //Loops through the given data and calls the interval and date shifting routine
  const incomingBookingsDataParser = (data) => {
    const convertedData = {};
    for (const tableNumber in data) {
      for (const date in data[tableNumber]) {
        for (const interval in data[tableNumber][date]) {
          const [correctedDate, correctedIntervalNumber] =
            intervalCorrectionBasedOnTimeZone(parseInt(interval), date, false);

          addProps(
            convertedData,
            [tableNumber, correctedDate, correctedIntervalNumber],
            data[tableNumber][date][interval]
          );
        }
      }
    }

    return convertedData;
  };

  const sendToServer = async (userBookings) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      setWaitingForServer(true);

      const res = await httpClient.post(
        "/api/bookings",
        {
          data: userBookings,
        },
        config
      );
      setBookings(incomingBookingsDataParser(res?.data?.data || {}));
      setMessage("Sikeres foglalás!");
      setUnsavedChanges(false);
      setWaitingForServer(false);
    } catch (error) {
      setWaitingForServer(false);

      if (error?.response?.data?.errors) setErrors(error.response.data.errors);

      if (error?.response?.data?.msg) setError(error.response.data.msg);

      if (error?.response?.data?.data)
        setBookings(incomingBookingsDataParser(error.response.data.data));

      if (error?.response?.data?.msg?.includes("Authentication error"))
        logout();
    }
  };

  const send = () => {
    const asyncFn = async () => {
      //creates a userBookings object to send to the server
      //this object contains the new bookings which are marked with "x" in the bookings state
      //userBookings is in the form: {tableNumber: {date : [interval numbers ...]}}
      const userBookings = {};
      for (const tableNumber in bookings) {
        for (const date in bookings[tableNumber]) {
          for (const interval in bookings[tableNumber][date]) {
            if (bookings[tableNumber][date][interval] === "x") {
              const [correctedDate, correctedIntervalNumber] =
                intervalCorrectionBasedOnTimeZone(
                  parseInt(interval),
                  date,
                  true
                );

              if (userBookings?.[tableNumber]?.[correctedDate])
                userBookings[tableNumber][correctedDate].push(
                  correctedIntervalNumber
                );
              else
                addProps(
                  userBookings,
                  [tableNumber, correctedDate],
                  [correctedIntervalNumber]
                );
            }
          }
        }
      }

      await sendToServer(userBookings);
    };

    asyncFn();
  };

  useEffect(() => {
    const asyncFn = async () => {
      createDateStrings();

      try {
        setWaitingForServer(true);

        const res = await httpClient.get("/api/bookings");

        setWaitingForServer(false);
        setBookings(incomingBookingsDataParser(res?.data?.data || {}));
      } catch (error) {
        console.log(error.response.data);
        setWaitingForServer(false);
        logout();
      }
    };

    asyncFn();
  }, []);

  return (
    <div className="BookingContainer">
      {message && (
        <div className="Message" onClick={(e) => setMessage("")}>
          {message}
        </div>
      )}
      {error && (
        <div className="Error" onClick={(e) => setError("")}>
          {error}
        </div>
      )}
      {errors.length && (
        <div className="Error" onClick={(e) => setErrors([])}>
          {errors.map((e, i) => (
            <p key={i}>{e.msg}</p>
          ))}
        </div>
      )}
      <div className="Booking">
        {waitingForServer && <LoadingMask />}
        {unsavedChanges && parseInt(selectedTableNumber) && (
          <button className="booking" onClick={send}>
            Foglalás küldése
          </button>
        )}
        <BookingContext.Provider
          value={{
            selectedTableNumber,
            setSelectedTableNumber,
            firstDayIndex,
            dateStrings,
            days,
            bookings,
            changeBookingState,
            send,
            unsavedChanges,
            addProps,
            intervalCorrectionBasedOnTimeZone,
            sendToServer,
          }}
        >
          <Dashboard />
          {parseInt(selectedTableNumber) ? <BookingTable /> : <DateBooking />}
        </BookingContext.Provider>
      </div>
    </div>
  );
};

export default connect(null, { logout })(Booking);
