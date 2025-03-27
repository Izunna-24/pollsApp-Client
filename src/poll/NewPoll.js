import React, { useState } from 'react';
import { createPoll } from '../util/APIUtils';
import { MAX_CHOICES, POLL_QUESTION_MAX_LENGTH, POLL_CHOICE_MAX_LENGTH } from '../constants';
import './NewPoll.css';
import { Form, Input, Button, Select, Col, notification } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const NewPoll = ({ history, handleLogout }) => {
    const [question, setQuestion] = useState({ text: '', validateStatus: '', errorMsg: '' });
    const [choices, setChoices] = useState([{ text: '' }, { text: '' }]);
    const [pollLength, setPollLength] = useState({ days: 1, hours: 0 });

    const addChoice = () => {
        if (choices.length < MAX_CHOICES) {
            setChoices([...choices, { text: '' }]);
        }
    };

    const removeChoice = (index) => {
        setChoices(choices.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const pollData = { question: question.text, choices, pollLength };
        try {
            await createPoll(pollData);
            history.push('/');
        } catch (error) {
            if (error.status === 401) {
                handleLogout('/login', 'error', 'You have been logged out. Please login to create a poll.');
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        }
    };

    const validateInput = (text, maxLength, errorMsg) => {
        if (!text) return { validateStatus: 'error', errorMsg };
        if (text.length > maxLength) return { validateStatus: 'error', errorMsg: `Maximum ${maxLength} characters allowed` };
        return { validateStatus: 'success', errorMsg: null };
    };

    const handleQuestionChange = (event) => {
        const text = event.target.value;
        setQuestion({ text, ...validateInput(text, POLL_QUESTION_MAX_LENGTH, 'Please enter your question!') });
    };

    const handleChoiceChange = (event, index) => {
        const text = event.target.value;
        const updatedChoices = [...choices];
        updatedChoices[index] = { text, ...validateInput(text, POLL_CHOICE_MAX_LENGTH, 'Please enter a choice!') };
        setChoices(updatedChoices);
    };

    const isFormInvalid = () => question.validateStatus !== 'success' || choices.some(c => c.validateStatus !== 'success');

    return (
        <div className="new-poll-container">
            <h1 className="page-title">Create Poll</h1>
            <div className="new-poll-content">
                <Form onSubmit={handleSubmit} className="create-poll-form">
                    <Form.Item validateStatus={question.validateStatus} help={question.errorMsg} className="poll-form-row">
                        <TextArea
                            placeholder="Enter your question"
                            style={{ fontSize: '16px' }}
                            autoSize={{ minRows: 3, maxRows: 6 }}
                            value={question.text}
                            onChange={handleQuestionChange}
                        />
                    </Form.Item>
                    {choices.map((choice, index) => (
                        <Form.Item key={index} validateStatus={choice.validateStatus} help={choice.errorMsg} className="poll-form-row">
                            <Input
                                placeholder={`Choice ${index + 1}`}
                                size="large"
                                value={choice.text}
                                onChange={(e) => handleChoiceChange(e, index)}
                            />
                            {index > 1 && <Button type="link" onClick={() => removeChoice(index)}>Remove</Button>}
                        </Form.Item>
                    ))}
                    <Form.Item className="poll-form-row">
                        <Button type="dashed" onClick={addChoice} disabled={choices.length === MAX_CHOICES}>Add a choice</Button>
                    </Form.Item>
                    <Form.Item className="poll-form-row">
                        <Col xs={24} sm={4}>Poll length:</Col>
                        <Col xs={24} sm={20}>
                            <Select value={pollLength.days} onChange={(value) => setPollLength({ ...pollLength, days: value })} style={{ width: 60 }}>
                                {[...Array(8).keys()].map(i => <Option key={i}>{i}</Option>)}
                            </Select> Days &nbsp;
                            <Select value={pollLength.hours} onChange={(value) => setPollLength({ ...pollLength, hours: value })} style={{ width: 60 }}>
                                {[...Array(24).keys()].map(i => <Option key={i}>{i}</Option>)}
                            </Select> Hours
                        </Col>
                    </Form.Item>
                    <Form.Item className="poll-form-row">
                        <Button type="primary" htmlType="submit" size="large" disabled={isFormInvalid()} className="create-poll-form-button">Create Poll</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default NewPoll;
