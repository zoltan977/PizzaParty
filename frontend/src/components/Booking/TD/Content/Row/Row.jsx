import React from "react";
import { connect } from "react-redux";

const Row = ({
  index,
  twoHours,
  bookingMatrix,
  changeBookingState,
  date,
  user,
}) => {
  const hour = twoHours * 2 + Math.floor((index * 15) / 60);
  const minute = index * 15 - Math.floor((index * 15) / 60) * 60;

  const bookingState = bookingMatrix?.[date]?.[index + twoHours * 8] || false;

  const check = () => {
    if (bookingState && bookingState !== "x") return;

    if (bookingState === "x")
      changeBookingState(false, date, index + twoHours * 8);
    else changeBookingState("x", date, index + twoHours * 8);
  };

  return (
    <tr onClick={check}>
      <td
        style={{
          backgroundColor:
            bookingState === "x"
              ? "gray"
              : bookingState === user.email
              ? "yellow"
              : bookingState
              ? "red"
              : "green",
        }}
      >
        <span className="hoursInContent">
          {hour < 10 ? `0${hour}` : hour} : {minute ? minute : "00"}
        </span>
      </td>
    </tr>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(Row);
