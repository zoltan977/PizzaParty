import './Login.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {logout, setToken} from '../../actions/authActions';
import LoadingMask from './../LoadingMask/LoadingMask.component';
import httpClient from 'axios';

const Login = ({logout, setToken}) => {

    let formValid = true

    const [error, setError] = useState(null);
    const [waitingForServer, setWaitingForServer] = useState(false);
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const {email, password} = user;

    const onChange = e => setUser({...user, [e.target.name]: e.target.value})
    
    const submit = async () => {

        if (formValid) {

            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            
            try {
              setWaitingForServer(true)
            
              const res = await httpClient.post("/api/login", user, config);
              console.log(res.data);
              setWaitingForServer(false)
              setToken(res.data.token)

            } catch (error) {
              console.log(error.response.data);
              setWaitingForServer(false)
              setError(error.response.data)
              logout()
            } 
                
        }
            
    }

    return (
        <div className="Login">
            {
                waitingForServer ? <LoadingMask/> :
                <div className="content">
                    <h1>Belépés</h1>
                    <div className="alerts">
                    {
                        function() {
                            let alerts = []
                            formValid = true

                            if (email === "" || password === "") {
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
                            <input type="email" name="email" value={email} onChange={onChange}/>
                        </div>
                        <div>
                            <label htmlFor="password">Jelszó</label>
                            <input type="password" name="password" value={password} onChange={onChange}/>
                        </div>
                        <button type="button" disabled={!formValid} onClick={submit}>Küldés</button>
                        <Link to="/forgot_password">Elfelejtett jelszó</Link>
                    </form>
                </div>
            }
        </div>
    )
}

export default connect(null, {logout, setToken})(Login)