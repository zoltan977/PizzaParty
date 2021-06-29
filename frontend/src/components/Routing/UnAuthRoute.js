import React, {useContext} from 'react';
import AuthContext from '../../context/auth/authContext';
import { Redirect, Route } from 'react-router-dom';

export default function PrivateRoute({component: Component, ...rest}) {
    
    const { isAuthenticated, loading } = useContext(AuthContext)

    return (
        <Route {...rest} render={props => 
            loading ? <p>Loading...</p>
                    : !isAuthenticated ? 
                        <Component {...props} />
                        :
                        <Redirect to="/" />

        }/>
    )
}
