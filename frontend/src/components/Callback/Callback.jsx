import "../Login/Login.css";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { setToken, logout } from "../../actions/authActions";
import { connect } from "react-redux";
import LoadingMask from "./../LoadingMask/LoadingMask.component";
import httpClient from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Callback = ({ setToken, logout }) => {
  const query = useQuery();
  const history = useHistory();

  const [waitingForServer, setWaitingForServer] = useState(false);

  useEffect(() => {
    const asyncFn = async (_) => {
      const code = query.get("code");

      try {
        setWaitingForServer(true);

        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await httpClient.post("/api/google", { code }, config);

        console.log("google callback /api/google res.data:", res.data);

        setWaitingForServer(false);

        setToken(res.data.token);
      } catch (error) {
        console.log("google callback /api/google error:", error.response.data);

        setWaitingForServer(false);

        logout();
      }

      history.push("/");
    };

    asyncFn();
  }, []);

  return <div className="Callback">{waitingForServer && <LoadingMask />}</div>;
};

export default connect(null, { setToken, logout })(Callback);
