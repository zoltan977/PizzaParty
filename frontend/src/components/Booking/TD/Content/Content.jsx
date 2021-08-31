import React from "react";
import Row from "./Row/Row";

export default function Content(props) {
  return (
    <table className="ContentTable">
      <tbody>
        {(function () {
          let trArr = [];
          for (let index = 0; index < 8; index++) {
            trArr.push(<Row key={index} index={index} {...props} />);
          }
          return trArr;
        })()}
      </tbody>
    </table>
  );
}
