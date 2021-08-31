import React, { useState } from "react";
import Content from "./Content/Content";

export default function Td(props) {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="Td">
      <div className="cover" onClick={(e) => setShowOverlay(true)}></div>
      {showOverlay && (
        <div className="overlay">
          <h1>{props.date}</h1>
          <span className="close" onClick={(e) => setShowOverlay(false)}>
            X
          </span>
          <Content {...props} />
        </div>
      )}
      <Content {...props} />
    </div>
  );
}
