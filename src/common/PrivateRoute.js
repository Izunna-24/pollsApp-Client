import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
    return authenticated ? (
        <Route {...rest} element={<Component />} />
    ) : (
        <Navigate to="/login" replace state={{ from: rest.location }} />
    );
};

export default PrivateRoute;
