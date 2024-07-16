import axios from 'axios';

const {
    REACT_APP_SERVER
  } = process.env;

export default axios.create({
    baseURL: REACT_APP_SERVER
});

export const axiosPrivate = axios.create({
    baseURL: REACT_APP_SERVER,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});