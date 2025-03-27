import React, { Component } from 'react';
import PollList from '../../poll/PollList';
import { getUserProfile } from '../../util/APIUtils';
import { Avatar, Tabs } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';

const { TabPane } = Tabs;

class Profile extends Component {
    state = {
        user: null,
        isLoading: false,
        notFound: false,
        serverError: false
    };

    componentDidMount() {
        this.loadUserProfile(this.props.match.params.username);
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.username !== prevProps.match.params.username) {
            this.loadUserProfile(this.props.match.params.username);
        }
    }

    loadUserProfile = (username) => {
        this.setState({ isLoading: true, notFound: false, serverError: false });

        getUserProfile(username)
            .then(user => this.setState({ user, isLoading: false }))
            .catch(error => this.setState({
                isLoading: false,
                notFound: error.status === 404,
                serverError: error.status !== 404
            }));
    };

    renderContent() {
        const { isLoading, notFound, serverError, user } = this.state;

        if (isLoading) return <LoadingIndicator />;
        if (notFound) return <NotFound />;
        if (serverError) return <ServerError />;

        if (!user) return null;

        return (
            <div className="user-profile">
                <div className="user-details">
                    <div className="user-avatar">
                        <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(user.name) }}>
                            {user.name[0].toUpperCase()}
                        </Avatar>
                    </div>
                    <div className="user-summary">
                        <div className="full-name">{user.name}</div>
                        <div className="username">@{user.username}</div>
                        <div className="user-joined">Joined {formatDate(user.joinedAt)}</div>
                    </div>
                </div>
                <div className="user-poll-details">
                    <Tabs defaultActiveKey="1" animated={false} tabBarStyle={{ textAlign: 'center' }} size="large" className="profile-tabs">
                        <TabPane tab={`${user.pollCount} Polls`} key="1">
                            <PollList username={this.props.match.params.username} type="USER_CREATED_POLLS" />
                        </TabPane>
                        <TabPane tab={`${user.voteCount} Votes`} key="2">
                            <PollList username={this.props.match.params.username} type="USER_VOTED_POLLS" />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }

    render() {
        return <div className="profile">{this.renderContent()}</div>;
    }
}

export default Profile;
