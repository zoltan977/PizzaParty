import "./DateBooking.css";
import React, { useState, useContext } from "react";
import { connect } from "react-redux";
import BookingContext from "../BookingContext/BookingContext";

const DateBooking = ({ user }) => {
  const {
    dateStrings,
    bookings,
    addProps,
    intervalCorrectionBasedOnTimeZone,
    sendToServer,
    setSelectedTableNumber,
  } = useContext(BookingContext);

  const quarterHourOptions = [];
  for (let minute = 0; minute < 60; minute += 15) {
    quarterHourOptions.push(
      <option key={minute} value={minute}>
        {minute}
      </option>
    );
  }

  const hourOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    hourOptions.push(
      <option key={hour} value={hour}>
        {hour}
      </option>
    );
  }

  const dateOptions = dateStrings.map((d, i) => (
    <option key={i} value={i}>
      {d}
    </option>
  ));

  const [startDateIndex, setStartDateIndex] = useState(0);
  const [endDateIndex, setEndDateIndex] = useState(0);
  const [hourStart, setHourStart] = useState(0);
  const [minuteStart, setMinuteStart] = useState(0);
  const [hourEnd, setHourEnd] = useState(0);
  const [minuteEnd, setMinuteEnd] = useState(0);

  const [message, setMessage] = useState("");

  const bookFreeTable = (dataToSend, freeTable) => {
    const userBookings = {};

    for (const date in dataToSend) {
      for (const interval of dataToSend[date]) {
        //does the interval and date corrections based on time zone
        const [correctedDate, correctedIntervalNumber] =
          intervalCorrectionBasedOnTimeZone(parseInt(interval), date, true);

        //adds free table as tableNumber and the corrected date and interval to the data to send
        if (userBookings?.[freeTable]?.[correctedDate])
          userBookings[freeTable][correctedDate].push(correctedIntervalNumber);
        else
          addProps(
            userBookings,
            [freeTable, correctedDate],
            [correctedIntervalNumber]
          );
      }
    }

    sendToServer(userBookings);
    setSelectedTableNumber(freeTable);
  };

  // Checks if there is a table where all the intervals
  // given in the dataToCheck object are free
  // gives back the number of the free table
  // or false if there is no free table
  const checkFreeTable = (dataToCheck) => {
    if (!Object.keys(dataToCheck).length) return false;

    for (let tableNumber = 1; tableNumber < 11; tableNumber++) {
      let free = true;
      for (const date in dataToCheck) {
        if (!free) break;
        for (const interval of dataToCheck[date]) {
          if (!free) break;
          if (
            bookings?.[tableNumber]?.[date]?.[interval] &&
            bookings?.[tableNumber]?.[date]?.[interval] !== "x" &&
            bookings?.[tableNumber]?.[date]?.[interval] !== user.email
          )
            free = false;
        }
      }

      if (free) return tableNumber;
    }

    return false;
  };

  //Converts the dates/hours/minutes to an object
  //which is in the form: {date1: [1,2,..], date2: [1,2..], ...}
  //where the arrays contain the interval numbers of the corresponding date
  const convertSelectedValuesToObject = () => {
    const dataToCheck = {};

    if (startDateIndex === endDateIndex) {
      const intervals = [];
      for (
        let index = hourStart * 4 + Math.floor(minuteStart / 15);
        index < hourEnd * 4 + Math.floor(minuteEnd / 15);
        index++
      ) {
        intervals.push(index);
      }
      if (intervals.length)
        addProps(dataToCheck, [dateStrings[startDateIndex]], intervals);
    } else if (endDateIndex > startDateIndex) {
      if (endDateIndex - startDateIndex > 1) {
        const intervalsOfFullDay = [];
        for (let interval = 0; interval < 96; interval++) {
          intervalsOfFullDay.push(interval);
        }

        for (let index = startDateIndex + 1; index < endDateIndex; index++) {
          addProps(dataToCheck, [dateStrings[index]], intervalsOfFullDay);
        }
      }

      const startDateIntervals = [];
      for (
        let interval = hourStart * 4 + Math.floor(minuteStart / 15);
        interval < 96;
        interval++
      ) {
        startDateIntervals.push(interval);
      }
      if (startDateIntervals.length)
        addProps(
          dataToCheck,
          [dateStrings[startDateIndex]],
          startDateIntervals
        );

      const endDateIntervals = [];
      for (
        let interval = 0;
        interval < hourEnd * 4 + Math.floor(minuteEnd / 15);
        interval++
      ) {
        endDateIntervals.push(interval);
      }
      if (endDateIntervals.length)
        addProps(dataToCheck, [dateStrings[endDateIndex]], endDateIntervals);
    }

    const freeTable = checkFreeTable(dataToCheck);
    if (freeTable) {
      bookFreeTable(dataToCheck, freeTable);
      setMessage(`Van szabad asztal. Az asztal száma: ${freeTable}`);
    } else {
      setMessage("Nincs szabad asztal erre az időpontra!");
    }
  };

  return (
    <div className="DateBooking">
      <h1>Időpont foglalás</h1>

      <table>
        <tbody>
          <tr>
            <td colSpan="3">
              <div className="start">Kezdés</div>
            </td>
          </tr>
          <tr>
            <td>
              Nap:
              <select
                onChange={(e) => {
                  setMessage("");
                  setStartDateIndex(parseInt(e.target.value));
                }}
              >
                {dateOptions}
              </select>
            </td>
            <td>
              <span className="time">Óra:</span>
              <select
                onChange={(e) => {
                  setMessage("");
                  setHourStart(parseInt(e.target.value));
                }}
              >
                {hourOptions}
              </select>
            </td>
            <td>
              <span className="time">Perc:</span>
              <select
                onChange={(e) => {
                  setMessage("");
                  setMinuteStart(parseInt(e.target.value));
                }}
              >
                {quarterHourOptions}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="3">
              <div className="end">Vége</div>
            </td>
          </tr>
          <tr>
            <td>
              Nap:
              <select
                onChange={(e) => {
                  setMessage("");
                  setEndDateIndex(parseInt(e.target.value));
                }}
              >
                {dateOptions}
              </select>
            </td>
            <td>
              <span className="time">Óra:</span>
              <select
                onChange={(e) => {
                  setMessage("");
                  setHourEnd(parseInt(e.target.value));
                }}
              >
                {hourOptions}
                <option value={24}>{24}</option>
              </select>
            </td>
            <td>
              <span className="time">Perc:</span>
              <select
                onChange={(e) => {
                  setMessage("");
                  setMinuteEnd(parseInt(e.target.value));
                }}
              >
                {parseInt(hourEnd) === 24 ? (
                  <option value={0}>0</option>
                ) : (
                  quarterHourOptions
                )}
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <button onClick={convertSelectedValuesToObject}>Foglalás</button>

      {message && <p>{message}</p>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(DateBooking);
