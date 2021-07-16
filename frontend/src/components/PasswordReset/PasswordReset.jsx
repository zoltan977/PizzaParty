import React, { useState } from 'react';
import axios from 'axios';
import {useLocation, useHistory} from 'react-router-dom';
import '../Login/Login.css';


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function PasswordReset() {

    let formValid = true

    let query = useQuery();
    let history = useHistory();

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const passwordChanged = e => setPassword(e.target.value)
    
    const submit = () => {

        const sendPassword = async _ => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            try {
                await axios.post("/api/password", {
                    email: query.get("email"),
                    code: query.get("code"),
                    password
                }, config)

                setSuccess(true)

                setTimeout(() => {
                    history.push("/login")
                }, 1000);
                
            } catch (error) {
                setError(error.response.data)
            }
        }

        if (formValid)
            sendPassword()
    }

    return (
        <div className="PasswordReset">
            {
                !success ?

                <div className="content">
                    <h1>Add meg az új jelszavad!</h1>
                    <div className="alerts">
                    {
                        function() {
                            let alerts = []
                            formValid = true

                            if (password === "") {
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
                            <label htmlFor="password">jelszó</label>
                            <input type="password" name="password" value={password} onChange={passwordChanged}/>
                        </div>
                        
                        <button type="button" disabled={!formValid} onClick={submit}>Küldés</button>
                    </form>
                </div>
                :
                <div className="content">
                    <div className="alerts">
                        <p>
                            Az új jelszó beállításra került
                        </p>
                    </div>
                </div>
            }
        </div>
    )
}
