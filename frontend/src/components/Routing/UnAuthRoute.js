import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

const UnAuthRoute = ({isAuthenticated, loading, component: Component, ...rest}) => {

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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
})

export default connect(mapStateToProps)(UnAuthRoute)