import React, { Component } from 'react';
import { Avatar, Icon, Radio, Button } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';
import './Poll.css';

const RadioGroup = Radio.Group;

class Poll extends Component {
    calculatePercentage = (choice) => this.props.poll.totalVotes === 0 ? 0 : (choice.voteCount * 100) / this.props.poll.totalVotes;

    isSelected = (choice) => this.props.poll.selectedChoice === choice.id;

    getWinningChoice = () => this.props.poll.choices.reduce((prev, curr) => (curr.voteCount > prev.voteCount ? curr : prev), { voteCount: -Infinity });

    getTimeRemaining = (poll) => {
        const diff = new Date(poll.expirationDateTime) - new Date();
        if (diff <= 0) return "less than a second left";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return days > 0 ? `${days} days left` : hours > 0 ? `${hours} hours left` : minutes > 0 ? `${minutes} minutes left` : `${seconds} seconds left`;
    };

    render() {
        const { poll, handleVoteChange, handleVoteSubmit, currentVote } = this.props;
        const pollChoices = poll.choices.map(choice => (
            poll.selectedChoice || poll.expired ? (
                <CompletedOrVotedPollChoice
                    key={choice.id}
                    choice={choice}
                    isWinner={poll.expired && choice.id === this.getWinningChoice().id}
                    isSelected={this.isSelected(choice)}
                    percentVote={this.calculatePercentage(choice)}
                />
            ) : (
                <Radio className="poll-choice-radio" key={choice.id} value={choice.id}>{choice.text}</Radio>
            )
        ));

        return (
            <div className="poll-content">
                <div className="poll-header">
                    <div className="poll-creator-info">
                        <Link className="creator-link" to={`/users/${poll.createdBy.username}`}>
                            <Avatar className="poll-creator-avatar" style={{ backgroundColor: getAvatarColor(poll.createdBy.name)}}>
                                {poll.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-name">{poll.createdBy.name}</span>
                            <span className="poll-creator-username">@{poll.createdBy.username}</span>
                            <span className="poll-creation-date">{formatDateTime(poll.creationDateTime)}</span>
                        </Link>
                    </div>
                    <div className="poll-question">{poll.question}</div>
                </div>
                <div className="poll-choices">
                    <RadioGroup className="poll-choice-radio-group" onChange={handleVoteChange} value={currentVote}>
                        {pollChoices}
                    </RadioGroup>
                </div>
                <div className="poll-footer">
                    {!poll.selectedChoice && !poll.expired && (
                        <Button className="vote-button" disabled={!currentVote} onClick={handleVoteSubmit}>Vote</Button>
                    )}
                    <span className="total-votes">{poll.totalVotes} votes</span>
                    <span className="separator">•</span>
                    <span className="time-left">{poll.expired ? "Final results" : this.getTimeRemaining(poll)}</span>
                </div>
            </div>
        );
    }
}

const CompletedOrVotedPollChoice = ({ choice, isWinner, isSelected, percentVote }) => (
    <div className="cv-poll-choice">
        <span className="cv-poll-choice-details">
            <span className="cv-choice-percentage">{Math.round(percentVote * 100) / 100}%</span>
            <span className="cv-choice-text">{choice.text}</span>
            {isSelected && <Icon className="selected-choice-icon" type="check-circle-o" />}
        </span>
        <span className={`cv-choice-percent-chart ${isWinner ? 'winner' : ''}`} style={{ width: `${percentVote}%` }}></span>
    </div>
);

export default Poll;
