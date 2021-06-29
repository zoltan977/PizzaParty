import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext'
import './Register.css';

export default function Register(props) {

    let formValid = true
    
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });
   
    const {name, email, password, password2} = user;

    const authContext = useContext(AuthContext)
    const { register, error, clearErrors } = authContext

    useEffect(() => {
        clearErrors()
    }, []);

    const onChange = e => setUser({...user, [e.target.name]: e.target.value})


    const submit = () => {

        if (formValid)
            register({
                name,
                email,
                password
            })
    }

    return (
        <div className="Register">
            <div className="content">
                <h1>Account Register</h1>
                <div className="alerts">
                {
                    function() {
                        let alerts = []
                        formValid = true

                        if (name === "" || email === "" || password === "") {
                            alerts.push(<p key={alerts.length + 1}>Please fill every field!</p>)
                            formValid = false
                        }
                        if (password !== password2) {
                            alerts.push(<p key={alerts.length + 1}>Passwords do not match!</p>)
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
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={name} onChange={onChange}/>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange}/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange}/>
                    </div>
                    <div>
                        <label htmlFor="password2">Confirm Password</label>
                        <input type="password" name="password2" value={password2} onChange={onChange}/>
                    </div>
                    <button type="button" disabled={!formValid} onClick={submit}>Register</button>
                </form>
            </div>
        </div>
    )
}
