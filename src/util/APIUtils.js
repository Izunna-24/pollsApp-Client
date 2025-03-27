import { API_BASE_URL, POLL_LIST_SIZE, ACCESS_TOKEN } from '../constants';

const getAuthHeaders = () => {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) headers.append('Authorization', `Bearer ${token}`);
    return headers;
};

const request = (options) => {
    return fetch(options.url, { ...options, headers: getAuthHeaders() })
        .then(async response => {
            const json = await response.json();
            if (!response.ok) return Promise.reject(json);
            return json;
        });
};

const get = (url) => request({ url, method: 'GET' });
const post = (url, body) => request({ url, method: 'POST', body: JSON.stringify(body) });

export const getAllPolls = (page = 0, size = POLL_LIST_SIZE) =>
    get(`${API_BASE_URL}/polls?page=${page}&size=${size}`);

export const createPoll = (pollData) => post(`${API_BASE_URL}/polls`, pollData);
export const castVote = (voteData) => post(`${API_BASE_URL}/polls/${voteData.pollId}/votes`, voteData);
export const login = (loginRequest) => post(`${API_BASE_URL}/auth/signin`, loginRequest);
export const signup = (signupRequest) => post(`${API_BASE_URL}/auth/signup`, signupRequest);
export const checkUsernameAvailability = (username) => get(`${API_BASE_URL}/user/checkUsernameAvailability?username=${username}`);
export const checkEmailAvailability = (email) => get(`${API_BASE_URL}/user/checkEmailAvailability?email=${email}`);

export const getCurrentUser = () =>
    localStorage.getItem(ACCESS_TOKEN) ? get(`${API_BASE_URL}/user/me`) : Promise.reject("No access token set.");

export const getUserProfile = (username) => get(`${API_BASE_URL}/users/${username}`);
export const getUserCreatedPolls = (username, page = 0, size = POLL_LIST_SIZE) =>
    get(`${API_BASE_URL}/users/${username}/polls?page=${page}&size=${size}`);
export const getUserVotedPolls = (username, page = 0, size = POLL_LIST_SIZE) =>
    get(`${API_BASE_URL}/users/${username}/votes?page=${page}&size=${size}`);
