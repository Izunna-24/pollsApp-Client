import React, { useState } from 'react';
import { signup, checkUsernameAvailability, checkEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';
import { Form, Input, Button, notification } from 'antd';

const Signup = () => {
    const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (event, validationFun) => {
        const { name, value } = event.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validationFun(value) }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await signup(form);
            notification.success({
                message: 'Polling App',
                description: "Thank you! You're successfully registered. Please Login to continue!",
            });
            navigate('/login');
        } catch (error) {
            notification.error({
                message: 'Polling App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        }
    };

    const validateField = (value, minLength, maxLength, fieldName) => {
        if (value.length < minLength) return `Minimum ${minLength} characters required.`;
        if (value.length > maxLength) return `Maximum ${maxLength} characters allowed.`;
        return '';
    };

    const validateEmail = (email) => {
        if (!email) return 'Email cannot be empty';
        if (!/^[^@ ]+@[^@ ]+\.[^@ ]+$/.test(email)) return 'Invalid email format';
        if (email.length > EMAIL_MAX_LENGTH) return `Maximum ${EMAIL_MAX_LENGTH} characters allowed.`;
        return '';
    };

    const validateAvailability = async (value, checkFunction, field) => {
        if (errors[field]) return;
        try {
            const response = await checkFunction(value);
            setErrors(prev => ({ ...prev, [field]: response.available ? '' : `${field} is already taken.` }));
        } catch {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const isFormInvalid = () => Object.values(errors).some(error => error !== '');

    return (
        <div className="signup-container">
            <h1 className="page-title">Sign Up</h1>
            <div className="signup-content">
                <Form onSubmitCapture={handleSubmit} className="signup-form">
                    <Form.Item label="Full Name" help={errors.name} validateStatus={errors.name ? 'error' : 'success'}>
                        <Input
                            size="large"
                            name="name"
                            placeholder="Your full name"
                            value={form.name}
                            onChange={(e) => handleInputChange(e, (val) => validateField(val, NAME_MIN_LENGTH, NAME_MAX_LENGTH, 'name'))}
                        />
                    </Form.Item>
                    <Form.Item label="Username" help={errors.username} validateStatus={errors.username ? 'error' : 'success'}>
                        <Input
                            size="large"
                            name="username"
                            placeholder="A unique username"
                            value={form.username}
                            onBlur={() => validateAvailability(form.username, checkUsernameAvailability, 'username')}
                            onChange={(e) => handleInputChange(e, (val) => validateField(val, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, 'username'))}
                        />
                    </Form.Item>
                    <Form.Item label="Email" help={errors.email} validateStatus={errors.email ? 'error' : 'success'}>
                        <Input
                            size="large"
                            name="email"
                            type="email"
                            placeholder="Your email"
                            value={form.email}
                            onBlur={() => validateAvailability(form.email, checkEmailAvailability, 'email')}
                            onChange={(e) => handleInputChange(e, validateEmail)}
                        />
                    </Form.Item>
                    <Form.Item label="Password" help={errors.password} validateStatus={errors.password ? 'error' : 'success'}>
                        <Input
                            size="large"
                            name="password"
                            type="password"
                            placeholder="A password between 6 to 20 characters"
                            value={form.password}
                            onChange={(e) => handleInputChange(e, (val) => validateField(val, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, 'password'))}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" disabled={isFormInvalid()}>
                            Sign up
                        </Button>
                        Already registered? <Link to="/login">Login now!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Signup;
