import '../Login/Login.css';
import React, {useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import { google } from '../../actions/authActions';
import { connect } from 'react-redux';
import LoadingMask from './../LoadingMask/LoadingMask.component';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Callback = ({google, waitingForServerResponse}) => {
        
    const query = useQuery();
    const history = useHistory();

    useEffect(() => {
        const asyncFn = async _ => {
            const code = query.get("code")

            console.log("Callback component code:", code);
            google(code)

            history.push("/")
        }

        asyncFn()

    }, [])

    return (
        <div className="Callback">
            {
                waitingForServerResponse && <LoadingMask/>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    waitingForServerResponse: state.auth.waitingForServerResponse
})

export default connect(mapStateToProps, {google})(Callback)