import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/auth/authContext';
import './Login.css';

export default function Login(props) {

    let formValid = true

    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const {email, password} = user;

    const authContext = useContext(AuthContext)
    const { login, error, clearErrors } = authContext

    useEffect(() => {
        clearErrors()
    }, []);


    const onChange = e => setUser({...user, [e.target.name]: e.target.value})
    
    const submit = () => {

        if (formValid)
            login({
                email,
                password
            })
    }

    return (
        <div className="Login">
            <div className="content">
                <h1>Account Login</h1>
                <div className="alerts">
                {
                    function() {
                        let alerts = []
                        formValid = true

                        if (email === "" || password === "") {
                            alerts.push(<p key={alerts.length + 1}>Please fill every field!</p>)
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
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange}/>
                    </div>
                    <button type="button" disabled={!formValid} onClick={submit}>Login</button>
                </form>
            </div>
        </div>
    )
}
