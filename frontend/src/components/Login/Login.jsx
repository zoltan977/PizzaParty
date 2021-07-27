import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {login, clearErrors} from '../../actions/authActions';
import './Login.css';
import LoadingMask from './../LoadingMask/LoadingMask.component';

const Login = ({clearErrors, login, error, waitingForServerResponse}) => {

    let formValid = true

    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const {email, password} = user;

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
            {
                waitingForServerResponse ? <LoadingMask/> :
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

const mapStateToProps = state => ({
    error: state.auth.error,
    waitingForServerResponse: state.auth.waitingForServerResponse
})

export default connect(mapStateToProps, {login, clearErrors})(Login)