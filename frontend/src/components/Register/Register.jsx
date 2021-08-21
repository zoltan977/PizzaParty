import "../Login/Login.css";
import React, { useState } from "react";
import { connect } from "react-redux";
import LoadingMask from "../LoadingMask/LoadingMask.component";
import httpClient from "axios";
import { logout } from "./../../actions/authActions";

const Register = ({ logout }) => {
  let formValid = true;

  const [error, setError] = useState(null);
  const [registration_success, setRegistration_success] = useState(false);
  const [waitingForServer, setWaitingForServer] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const submit = async () => {
    if (formValid) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        setWaitingForServer(true);

        const res = await httpClient.post(
          "/api/register",
          { name, email, password },
          config
        );

        console.log("register action res.data: ", res.data);

        setWaitingForServer(false);

        setRegistration_success(true);
      } catch (error) {
        console.log(error.response.data);
        setWaitingForServer(false);
        setError(error.response.data);
        logout();
      }
    }
  };

  return (
    <div className="Register">
      {waitingForServer ? (
        <LoadingMask />
      ) : !registration_success ? (
        <div className="content">
          <h1>Regisztráció</h1>
          <div className="alerts">
            {(function () {
              let alerts = [];
              formValid = true;

              if (name === "" || email === "" || password === "") {
                alerts.push(
                  <p key={alerts.length + 1}>Tölts ki minden mezőt!</p>
                );
                formValid = false;
              }
              if (password !== password2) {
                alerts.push(
                  <p key={alerts.length + 1}>Jelszavak nem egyeznek!</p>
                );
                formValid = false;
              }

              if (error) {
                if (error.msg)
                  alerts.push(<p key={alerts.length + 1}>{error.msg}</p>);

                if (error.errors) {
                  for (const err of error.errors) {
                    alerts.push(<p key={alerts.length + 1}>{err.msg}</p>);
                  }
                }
              }

              return alerts;
            })()}
          </div>
          <form>
            <div>
              <label htmlFor="name">Név</label>
              <input
                type="text"
                name="name"
                placeholder="név"
                value={name}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@mail.hu"
                value={email}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="password">Jelszó</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="password2">Jelszó megerősítés</label>
              <input
                type="password"
                name="password2"
                value={password2}
                onChange={onChange}
              />
            </div>
            <button type="button" disabled={!formValid} onClick={submit}>
              Küldés
            </button>
          </form>
        </div>
      ) : (
        <div className="registrationSucess">
          <div className="content">
            <h1>Sikeres Regisztáció!</h1>
            <div className="alerts">
              <p>
                Egy jóváhagyó email-t küldtünk a{" "}
                <span className="email">{email}</span> címre
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default connect(null, { logout })(Register);
