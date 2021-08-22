import "./navigation.css";
import React from "react";

//paging for pizzas and toppings
export default function Navigation({ props }) {
  return (
    <div className="navigation">
      <div>
        <span onClick={props.prev}>{"\u21e6"}</span>
        <span>
          <input value={props.quantityPerPage} onChange={props.change} />
          of
          <em>{props.data.length}</em>
          <span onClick={props.increaseQuantityPerPage}>{"\u2bc5"}</span>
          <span onClick={props.decreaseQuantityPerPage}>{"\u2bc6"}</span>
        </span>
        <span onClick={props.next}>{"\u21e8"}</span>
      </div>
      <div>
        <span>
          {Number(props.to) === 0 ? 0 : props.from + 1}-{props.to}
        </span>
      </div>
    </div>
  );
}
