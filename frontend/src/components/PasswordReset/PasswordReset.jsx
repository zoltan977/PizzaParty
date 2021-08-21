import "../Login/Login.css";
import React, { useState } from "react";
import httpClient from "axios";
import { useLocation, useHistory } from "react-router-dom";
import LoadingMask from "../LoadingMask/LoadingMask.component";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PasswordReset() {

  let query = useQuery();
  let history = useHistory();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [waitingForServer, setWaitingForServer] = useState(false);

  const passwordChanged = (e) => setPassword(e.target.value);

  const submit = () => {
    const sendPassword = async (_) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        setWaitingForServer(true);
        await httpClient.post(
          "/api/password",
          {
            email: query.get("email"),
            code: query.get("code"),
            password,
          },
          config
        );

        setSuccess(true);

        setTimeout(() => {
          history.push("/login");
        }, 1000);
      } catch (error) {
        setError(error.response.data);
      } finally {
        setWaitingForServer(false);
      }
    };

    if (password) sendPassword();
  };

  return (
    <div className="PasswordReset">
      {waitingForServer ? (
        <LoadingMask />
      ) : !success ? (
        <div className="content">
          <h1>Add meg az új jelszavad!</h1>
          <div className="alerts">
            {
              !password && <p>Tölts ki minden mezőt!</p>
            }
            {
              error && error.msg && <p>{error.msg}</p>
            }
            {
              error && error.errors && error.errors.map((e, i) => <p key={i}>{e.msg}</p>)
            }
          </div>
          <form>
            <div>
              <label htmlFor="password">jelszó</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={passwordChanged}
              />
            </div>

            <button type="button" disabled={!password} onClick={submit}>
              Küldés
            </button>
          </form>
        </div>
      ) : (
        <div className="content">
          <div className="alerts">
            <p>Az új jelszó beállításra került</p>
          </div>
        </div>
      )}
    </div>
  );
}
