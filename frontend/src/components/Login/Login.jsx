import "./Login.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout, setToken } from "../../actions/authActions";
import LoadingMask from "./../LoadingMask/LoadingMask.component";
import httpClient from "axios";

const Login = ({ logout, setToken }) => {
  const [error, setError] = useState(null);
  const [waitingForServer, setWaitingForServer] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!(!email || !password)) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        setWaitingForServer(true);

        const res = await httpClient.post("/api/login", user, config);
        console.log("login res.data:", res.data);
        setWaitingForServer(false);
        setToken(res.data.token);
      } catch (error) {
        console.log("login error:", error.response.data);
        setWaitingForServer(false);
        setError(error.response.data);
        logout();
      }
    }
  };

  return (
    <div className="Login">
      {waitingForServer ? (
        <LoadingMask />
      ) : (
        <div className="content">
          <h1>Belépés</h1>
          <div className="alerts">
            {(!email || !password) && <p>Tölts ki minden mezőt!</p>}
            {error && error.msg && <p>{error.msg}</p>}
            {error &&
              error.errors &&
              error.errors.map((e, i) => <p key={i}>{e.msg}</p>)}
          </div>
          <form>
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
            <button
              type="button"
              disabled={!email || !password}
              onClick={submit}
            >
              Küldés
            </button>
            <Link to="/forgot_password">Elfelejtett jelszó</Link>
          </form>
        </div>
      )}
    </div>
  );
};

export default connect(null, { logout, setToken })(Login);
