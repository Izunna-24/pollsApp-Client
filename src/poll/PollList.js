import React, { Component } from 'react';
import { getAllPolls, getUserCreatedPolls, getUserVotedPolls, castVote } from '../util/APIUtils';
import Poll from './Poll';
import LoadingIndicator from '../common/LoadingIndicator';
import { Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { POLL_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PollList.css';

class PollList extends Component {
    state = {
        polls: [],
        page: 0,
        totalPages: 0,
        last: true,
        currentVotes: [],
        isLoading: false
    };

    componentDidMount() {
        this.loadPollList();
    }

    componentDidUpdate(prevProps) {
        if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
            this.setState({ polls: [], page: 0, last: true, currentVotes: [] }, this.loadPollList);
        }
    }

    loadPollList = (page = 0, size = POLL_LIST_SIZE) => {
        let fetchPolls;
        const { username, type } = this.props;

        if (username) {
            fetchPolls = type === 'USER_CREATED_POLLS'
                ? getUserCreatedPolls(username, page, size)
                : type === 'USER_VOTED_POLLS'
                    ? getUserVotedPolls(username, page, size)
                    : null;
        } else {
            fetchPolls = getAllPolls(page, size);
        }

        if (!fetchPolls) return;

        this.setState({ isLoading: true });

        fetchPolls
            .then(({ content, page, totalPages, last }) => {
                this.setState(prevState => ({
                    polls: [...prevState.polls, ...content],
                    page,
                    totalPages,
                    last,
                    currentVotes: [...prevState.currentVotes, ...Array(content.length).fill(null)],
                    isLoading: false
                }));
            })
            .catch(() => this.setState({ isLoading: false }));
    };

    handleLoadMore = () => {
        this.loadPollList(this.state.page + 1);
    };

    handleVoteChange = (event, index) => {
        const value = event.target.value;
        this.setState(prevState => {
            const updatedVotes = [...prevState.currentVotes];
            updatedVotes[index] = value;
            return { currentVotes: updatedVotes };
        });
    };

    handleVoteSubmit = (event, index) => {
        event.preventDefault();
        if (!this.props.isAuthenticated) {
            this.props.history.push("/login");
            notification.info({ message: 'Polling App', description: "Please login to vote." });
            return;
        }

        const { polls, currentVotes } = this.state;
        const selectedChoice = currentVotes[index];

        castVote({ pollId: polls[index].id, choiceId: selectedChoice })
            .then(response => {
                this.setState(prevState => {
                    const updatedPolls = [...prevState.polls];
                    updatedPolls[index] = response;
                    return { polls: updatedPolls };
                });
            })
            .catch(error => {
                if (error.status === 401) {
                    this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');
                } else {
                    notification.error({ message: 'Polling App', description: error.message || 'Something went wrong!' });
                }
            });
    };

    render() {
        const { polls, last, isLoading } = this.state;

        return (
            <div className="polls-container">
                {polls.map((poll, index) => (
                    <Poll
                        key={poll.id}
                        poll={poll}
                        currentVote={this.state.currentVotes[index]}
                        handleVoteChange={event => this.handleVoteChange(event, index)}
                        handleVoteSubmit={event => this.handleVoteSubmit(event, index)}
                    />
                ))}

                {!isLoading && polls.length === 0 && (
                    <div className="no-polls-found">
                        <span>No Polls Found.</span>
                    </div>
                )}

                {!isLoading && !last && (
                    <div className="load-more-polls">
                        <Button type="dashed" onClick={this.handleLoadMore} disabled={isLoading}>
                            <PlusOutlined /> Load more
                        </Button>
                    </div>
                )}

                {isLoading && <LoadingIndicator />}
            </div>
        );
    }
}

export default withRouter(PollList);
