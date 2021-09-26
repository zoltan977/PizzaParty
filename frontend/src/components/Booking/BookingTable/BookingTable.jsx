import React, { useContext } from "react";
import TD from "../TD/Td";
import BookingContext from "../BookingContext/BookingContext";

export default function BookingTable() {
  const {
    firstDayIndex,
    dateStrings,
    days,
    bookings,
    selectedTableNumber,
    changeBookingState,
    send,
    unsavedChanges,
  } = useContext(BookingContext);

  return (
    <table className="BookingTable">
      <thead>
        <tr>
          <th className="hours"></th>
          {(function () {
            const thArray = [];
            for (
              let index = firstDayIndex, counter = 0;
              counter < 7;
              index++, counter++
            ) {
              thArray.push(
                <th key={counter}>
                  {dateStrings[counter]}
                  <br />({days[index]})
                </th>
              );

              if (index === 6) index = -1;
            }

            return thArray;
          })()}
        </tr>
      </thead>
      <tbody>
        {(function () {
          let trArr = [];
          for (let twoHours = 0; twoHours < 12; twoHours++) {
            let tdArr = [];
            for (let day = 0; day < 7; day++) {
              tdArr.push(
                <td key={day}>
                  <TD
                    date={dateStrings[day]}
                    twoHours={twoHours}
                    bookingMatrix={bookings?.[selectedTableNumber]}
                    changeBookingState={changeBookingState}
                    sendBooking={send}
                    unsavedChanges={unsavedChanges}
                  />
                </td>
              );
            }

            let hour = twoHours * 2;
            tdArr.unshift(
              <td key="7" className="hours">
                <span>{hour < 10 ? `0${hour}` : hour} : 00</span>
              </td>
            );

            trArr.push(<tr key={twoHours}>{tdArr}</tr>);
          }

          return trArr;
        })()}
      </tbody>
    </table>
  );
}
