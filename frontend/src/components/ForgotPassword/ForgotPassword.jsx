import '../Login/Login.css';
import React, { useState } from 'react';
import axios from 'axios';
import LoadingMask from '../LoadingMask/LoadingMask.component';


export default function ForgotPassword() {

    let formValid = true

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [waitingForServer, setWaitingForServer] = useState(false);

    const emailChanged = e => setEmail(e.target.value)
    
    const submit = () => {

        const sendEmail = async _ => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            try {
                setWaitingForServer(true)

                await axios.post("/api/reset", {email}, config)

                setSuccess(true)
                
            } catch (error) {
                setError(error.response.data)
            } finally {
                setWaitingForServer(false)
            }
        }

        if (formValid)
            sendEmail()
    }

    return (
        <div className="ForgotPassword">
            {
                waitingForServer ? <LoadingMask/> : 
                !success ?

                <div className="content">
                    <h1>Add meg melyik email címhez szeretnél új jelszót!</h1>
                    <div className="alerts">
                    {
                        function() {
                            let alerts = []
                            formValid = true

                            if (email === "") {
                                alerts.push(<p key={alerts.length + 1}>Tölts ki minden mezőt!</p>)
                                formValid = false
                            }

                            if (error) {
                                if (error.msg)
                                    alerts.push(<p key={alerts.length + 1}>{error.msg}</p>)

                                if (error.errors) {
                                    for (const err of error.errors) {
                                        alerts.push(<p key={alerts.length + 1}>{err.msg}</p>)
                                    }   
                                }
                            }

                            return alerts
                        }()
                    }
                    </div>
                    <form>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" value={email} onChange={emailChanged}/>
                        </div>
                        
                        <button type="button" disabled={!formValid} onClick={submit}>Küldés</button>
                    </form>
                </div>
                :
                <div className="content">
                    <div className="alerts">
                        <p>
                            Egy jelszó helyreállító email-t küldtünk a <span className="email">{email}</span> címre
                        </p>
                    </div>
                </div>
            }
        </div>
    )
}
