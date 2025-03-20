import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout, notification } from 'antd';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import PollList from '../poll/PollList';
import NewPoll from '../poll/NewPoll';
import Login from '../user/login/Login';
import Signup from '../user/signup/SignUp';
import Profile from '../user/profile/Profile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

const { Content } = Layout;

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    getCurrentUser()
        .then(response => {
          setCurrentUser(response);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
  };

  const handleLogout = (redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") => {
    localStorage.removeItem(ACCESS_TOKEN);
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate(redirectTo);
    notification[notificationType]({ message: 'Polling App', description });
  };

  const handleLogin = () => {
    notification.success({ message: 'Polling App', description: "You're successfully logged in." });
    loadCurrentUser();
    navigate("/");
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
      <Router>
        <Layout className="app-container">
          <AppHeader isAuthenticated={isAuthenticated} currentUser={currentUser} onLogout={handleLogout} />
          <Content className="app-content">
            <div className="container">
              <Routes>
                <Route path="/" element={<PollList isAuthenticated={isAuthenticated} currentUser={currentUser} handleLogout={handleLogout} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/users/:username" element={<Profile isAuthenticated={isAuthenticated} currentUser={currentUser} />} />
                <Route path="/poll/new" element={<PrivateRoute authenticated={isAuthenticated} component={NewPoll} handleLogout={handleLogout} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Router>
  );
};

export default App;
