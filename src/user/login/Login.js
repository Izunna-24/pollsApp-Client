import React, { Component } from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';
import { Form, Input, Button, notification } from 'antd';

class Login extends Component {
    render() {
        return (
            <div className="login-container">
                <h1 className="page-title">Login</h1>
                <div className="login-content">
                    <LoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                login(values)
                    .then(response => {
                        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                        this.props.onLogin();
                    })
                    .catch(error => {
                        notification.error({
                            message: 'Polling App',
                            description:
                                error.status === 401
                                    ? 'Your Username or Password is incorrect. Please try again!'
                                    : error.message || 'Sorry! Something went wrong. Please try again!',
                        });
                    });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('usernameOrEmail', {
                        rules: [{ required: true, message: 'Please input your username or email!' }],
                    })(
                        <Input prefix={<span className="anticon anticon-user" />} size="large" placeholder="Username or Email" />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<span className="anticon anticon-lock" />} size="large" type="password" placeholder="Password" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Login</Button>
                    Or <Link to="/signup">register now!</Link>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedLoginForm = Form.create()(LoginForm);
export default Login;
