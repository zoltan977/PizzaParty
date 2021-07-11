import React, { useEffect } from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import { confirm } from '../../actions/authActions';
import { resetConfirmationSuccess } from '../../actions/authActions';
import { connect } from 'react-redux';
import './Confirm.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Confirm = ({confirm, error, confirmation_success, resetConfirmationSuccess}) => {

    const query = useQuery();
    const history = useHistory();

    useEffect(() => {
        resetConfirmationSuccess()

        console.log("confirm email: ", query.get("email"));
        console.log("confirm code: ", query.get("code"));

        confirm(query.get("code"), query.get("email"))
        
    }, [])

    useEffect(() => {
        if (confirmation_success)
            history.push("/");
    }, [confirmation_success])


    return (
        <div className="Confirm">
            <div className="content">
                <h1>Registration confirmation!</h1>
                <div className="alerts">
                    {
                        function() {
                            let alerts = [];

                            if (error) {
                                if (error.msg)
                                    alerts.push(<p key={alerts.length + 1}>{error.msg}</p>)
    
                                if (error.errors) {
                                    for (const err of error.errors) {
                                        alerts.push(<p key={alerts.length + 1}>{err.msg}</p>)
                                    }   
                                }
                            } else {
                                alerts.push(<p key={alerts.length + 1}>Your registration has been confirmed!</p>)
                            }

                            return alerts;
                        }()
                    }
                </div>
            </div>
        </div> 
    )
}

const mapStateToProps = state => ({
    error: state.auth.error,
    confirmation_success: state.auth.confirmation_success
})

export default connect(mapStateToProps, {confirm, resetConfirmationSuccess})(Confirm)