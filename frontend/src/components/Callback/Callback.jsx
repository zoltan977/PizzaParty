import React, {useEffect} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import { google } from '../../actions/authActions';
import { connect } from 'react-redux';
import './Callback.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Callback = ({google}) => {
        
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
            
        </div>
    )
}

// const mapStateToProps = state => ({
//     loading: state.data.loading
// })

export default connect(null, {google})(Callback)