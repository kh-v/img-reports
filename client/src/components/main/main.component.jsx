import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import _ from 'lodash'

import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios';
import useAxiosPrivate from '../../api/useAxiosPrivate'
import {
  MainContainer,
  ReportsContainer
} from './main.style'


const {
  REACT_APP_SERVER
} = process.env;

export default function Main(props) {
  const navigate = useNavigate();
  const { auth, logout, setUsers, users, setActiveAgent, activeAgent } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    if (auth.admin) {
      axiosPrivate.get(`${REACT_APP_SERVER}/user/all_users\?username\=${auth.username}`)
      .then(res => {
        setUsers(res.data)
      }).catch(err => {
        console.log(err)
      })
    }
  }, [auth])

  let all_users = _.keyBy(users, 'username')
  return (
    <MainContainer>
      <ReportsContainer>
        <div>
          {
            !auth.admin ?
            <div>{activeAgent.name}</div>
            :
            <div>
              <select value={activeAgent.username} onChange={el => setActiveAgent(all_users[el.target.value])}>
                {
                  users.map(u => <option value={u.username}>{`${u.name}`}</option>)
                }
              </select>  
            </div>
          }
          <div>Rank: {activeAgent.rank}</div>
          <div>Agent Code: {activeAgent.username}</div>
        </div>
        <div onClick={() => navigate('/commission')} >Commission Reports</div>
        <div onClick={() => navigate('/production')}>Production Reports</div>
        <div onClick={() => navigate('/team')}>Team Reports</div>
        <div onClick={() => { logout() }}>Logout</div>
      </ReportsContainer>
    </MainContainer>
  );
}
