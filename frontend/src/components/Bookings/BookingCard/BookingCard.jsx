import React from "react";
import "./BookingCard.css";

export default function BookingCard({ tableNumber, start, end }) {
  const days = [
    "Vasárnap",
    "Hétfő",
    "Kedd",
    "Szerda",
    "Csütörtök",
    "Péntek",
    "Szombat",
  ];

  return (
    <div className="BookingCardContainer">
      <div className="BookingCard">
        <p>Foglalás a {tableNumber} számú asztalnál</p>
        <p>
          {new Date(start).toLocaleDateString()}{" "}
          {days[new Date(start).getDay()]}
          <br />
          {new Date(start).toLocaleTimeString()} -tól
        </p>
        <p>
          {new Date(end).toLocaleDateString()}
          <br />
          {days[new Date(end).getDay()]}
          <br />
          {new Date(end).toLocaleTimeString()} -ig
        </p>
      </div>
      <div className="shadow"></div>
    </div>
  );
}
