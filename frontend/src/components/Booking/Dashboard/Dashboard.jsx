import React, { useContext } from "react";
import BookingContext from "../BookingContext/BookingContext";

export default function Dashboard() {
  const { selectedTableNumber, setSelectedTableNumber } =
    useContext(BookingContext);

  return (
    <div className="dashBoard">
      <button
        onClick={(e) =>
          setSelectedTableNumber((prev) =>
            (parseInt(prev) - 1 >= 0 ? parseInt(prev) - 1 : 10).toString()
          )
        }
      >
        -
      </button>
      <select
        onChange={(e) => setSelectedTableNumber(e.target.value)}
        value={selectedTableNumber}
      >
        <option value="0">Időpont foglalás</option>
        <option value="1">1. asztal</option>
        <option value="2">2. asztal</option>
        <option value="3">3. asztal</option>
        <option value="4">4. asztal</option>
        <option value="5">5. asztal</option>
        <option value="6">6. asztal</option>
        <option value="7">7. asztal</option>
        <option value="8">8. asztal</option>
        <option value="9">9. asztal</option>
        <option value="10">10. asztal</option>
      </select>
      <button
        onClick={(e) =>
          setSelectedTableNumber((prev) =>
            (parseInt(prev) + 1 < 11 ? parseInt(prev) + 1 : 0).toString()
          )
        }
      >
        +
      </button>
    </div>
  );
}
