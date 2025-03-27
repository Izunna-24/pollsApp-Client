import React from 'react';
import './ServerError.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const ServerError = () => {
    return (
        <div className="server-error-page">
            <h1 className="server-error-title">500</h1>
            <p className="server-error-desc">
                Oops! Something went wrong!!
            </p>
            <Link to="/">
                <Button className="server-error-go-back-btn" type="primary" size="large">
                    Go Back
                </Button>
            </Link>
        </div>
    );
};

export default ServerError;
