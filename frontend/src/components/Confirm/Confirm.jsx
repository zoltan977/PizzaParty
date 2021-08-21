import "../Login/Login.css";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { logout, setToken } from "../../actions/authActions";
import { connect } from "react-redux";
import LoadingMask from "../LoadingMask/LoadingMask.component";
import httpClient from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Confirm = ({ logout, setToken }) => {
  const query = useQuery();
  const history = useHistory();

  const [waitingForServer, setWaitingForServer] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const asyncFn = async () => {
      const email = query.get("email");
      const code = query.get("code");

      try {
        setWaitingForServer(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await httpClient.post(
          "/api/confirm",
          {
            email,
            code,
          },
          config
        );

        console.log("confirm res.data: ", res.data);

        setWaitingForServer(false);

        setToken(res.data.token);

        history.push("/");
      } catch (error) {
        console.log(
          "confirm error.response.data: ",
          error.response.data
        );
        setWaitingForServer(false);
        setError(error.response.data);
        logout();
      }
    };

    asyncFn();
  }, []);

  return (
    <div className="Confirm">
      {waitingForServer ? (
        <LoadingMask />
      ) : (
        <>
          <div className="content">
            <h1>Regisztráció megerősítés!</h1>
            <div className="alerts">
              {
                error && error.msg && <p>{error.msg}</p>
              }
              {
                error && error.errors && error.errors.map((e, i) => <p key={i}>{e.msg}</p>)
              }
              {
                !error && <p>
                  A regisztrációd megerősítésre került!
                </p>
              }
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default connect(null, { logout, setToken })(Confirm);
