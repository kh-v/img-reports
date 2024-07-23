import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios';
import {
  LoginMainContainer,
  LoginFromContainer
} from './login.style'


const LOGIN_URL = '/auth';

export default function Login(props) {
  const { setUserAuth } = useAuth()
  const [cookies, setCookie] = useCookies(['jwt']);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(LOGIN_URL,
            JSON.stringify({ user, pwd }),
            {
              withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const accessToken = response?.data?.accessToken;
        const refreshToken = response?.data?.refreshToken;
        const username = response?.data?.username;
        const rank = response?.data?.rank;
        const name = response?.data?.name;
        
        // console.log(cookies)
       setCookie('jwt',refreshToken)

        setUserAuth({ user, accessToken, name, username, rank });
        setUser('');
        setPwd('');
        navigate(from, { replace: true });
    } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg('Login Failed');
        }
        errRef.current.focus();
    }
  }

  // if (currentUser) history("/replay")
 
  return (
    <LoginMainContainer>
      <LoginFromContainer>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <div>Login</div>
        {/* <div>
          Username<br />
          <input type="text" {...username} autoComplete="new-password" />
        </div>
        <div style={{ marginTop: 10 }}>
          Password<br />
          <input type="password" {...password} autoComplete="new-password" />
        </div>
        {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
        <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={(handleLogin)} disabled={loading} /><br /> */}

        <form onSubmit={handleSubmit}>
          <div>

            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
            />
          </div>
          <div>

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
            />
          </div>

            <button>Sign In</button>
        </form>
      </LoginFromContainer>
    </LoginMainContainer>
  );
}

// const useFormInput = initialValue => {
//   const [value, setValue] = useState(initialValue);
 
//   const handleChange = e => {
//     setValue(e.target.value);
//   }
//   return {
//     value,
//     onChange: handleChange
//   }
// }
 