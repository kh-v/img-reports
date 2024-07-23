import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios';
import {
  MainContainer,
  ReportsContainer
} from './main.style'


export default function Main(props) {
  const navigate = useNavigate();
  const { auth, logout } = useAuth()

  console.log(auth)
  return (
    <MainContainer>
      <ReportsContainer>
        <div>
          <div>{auth.name}</div>
          <div>Rank: {auth.rank}</div>
          <div>Agent Code: {auth.username}</div>
        </div>
        <div onClick={() => navigate('/commission')} >Commission Reports</div>
        <div onClick={() => navigate('/production')}>Production Reports</div>
        <div onClick={() => navigate('/team')}>Team Reports</div>
      </ReportsContainer>
    </MainContainer>
  );
}
