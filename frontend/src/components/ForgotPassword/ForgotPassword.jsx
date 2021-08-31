import "../Login/Login.css";
import React, { useState } from "react";
import httpClient from "axios";
import LoadingMask from "../LoadingMask/LoadingMask.component";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [waitingForServer, setWaitingForServer] = useState(false);

  const emailChanged = (e) => setEmail(e.target.value);

  const submit = () => {
    const sendEmail = async (_) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        setWaitingForServer(true);

        await httpClient.post("/api/reset", { email }, config);

        setSuccess(true);
      } catch (error) {
        setError(error.response.data);
      } finally {
        setWaitingForServer(false);
      }
    };

    if (email) sendEmail();
  };

  return (
    <div className="ForgotPassword">
      {waitingForServer ? (
        <LoadingMask />
      ) : !success ? (
        <div className="content">
          <h1>Add meg melyik email címhez szeretnél új jelszót!</h1>
          <div className="alerts">
            {!email && <p>Tölts ki minden mezőt!</p>}
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
                value={email}
                onChange={emailChanged}
              />
            </div>

            <button type="button" disabled={!email} onClick={submit}>
              Küldés
            </button>
          </form>
        </div>
      ) : (
        <div className="content">
          <div className="alerts">
            <p>
              Egy jelszó helyreállító email-t küldtünk a{" "}
              <span className="email">{email}</span> címre
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
