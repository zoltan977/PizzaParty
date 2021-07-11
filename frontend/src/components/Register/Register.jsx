import React, { useState, useEffect } from 'react';
import './Register.css';
import { connect } from 'react-redux';
import { register, clearErrors, resetRegistrationSuccess } from '../../actions/authActions'

const Register = ({resetRegistrationSuccess, clearErrors, register, error, registration_success}) => {

    let formValid = true
    
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });
   
    const {name, email, password, password2} = user;


    useEffect(() => {
        clearErrors()
        resetRegistrationSuccess()
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
            {
                !registration_success ?
                <div className="content">
                    <h1>Sign Up!</h1>
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
                :
                <div className="registrationSucess">
                    <div className="content">
                        <h1>Registration Success!</h1>
                        <div className="alerts">
                            <p>
                                A email has been sent to {email}
                            </p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    error: state.auth.error,
    registration_success: state.auth.registration_success
})

export default connect(mapStateToProps, {register, clearErrors, resetRegistrationSuccess})(Register)