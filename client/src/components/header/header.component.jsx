import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment-timezone'

import Liveclock from './liveclock.component';

import { useAuth } from '../../context/AuthContext';

import {
  HeaderContainer,
  Title,
  NewsBanner,
  NewsEntry,
  NewsTime,
  NewsImportance,
  StatusContainer,
  StatusItems,
  StatusItem,
  StatusDateTime,

  StatusDotIcon,
  SpxProsIcon,
  ProsIcon,
  MenuIcon,
  Menu,
  MenuItem
} from './header.style'

const {
  REACT_APP_ALGO,
  REACT_APP_WS
} = process.env;
 
export default function Header(props) {
  const navigate = useNavigate();
  const {name, layout, SetLayout, SetOpenSetting, SetUser} = props
  const { auth, logout } = useAuth()
  // const { sendMessage, lastMessage, readyState } = useWebSocket(REACT_APP_WS, {
  //   onOpen: (ev) => {
  //     sendMessage(`{ "action": "register_client", "Algo":"${algo}" }`)
  //   }
  // });

  const [algo, setAlgo] = useState(REACT_APP_ALGO||'Algo Auto');
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('Alert');
  const [openMenu, SetOpenMenu] = useState(false);

  console.log(window.location.pathname)

  useEffect(() => {
    if(title !== name) {
      setTitle(name)
      if (name === 'PROS') {
        document.title = 'Pros Alerts'
      } else {
        document.title = 'SPX Pros Alerts'
      }
    }

    // if (lastMessage !== null) {
    //   // setMessageHistory((prev) => prev.concat(lastMessage));
    //   let m = JSON.parse(lastMessage.data)
    //   // console.log(m)
    //   switch(m.action) {
    //     case 'events':
    //       setNews(m.data)
    //       break;

    //   }

    // }

    // console.log(lastMessage)
  // }, [lastMessage, title]);
  }, [title]);

  let pageName = ""
  switch(window.location.pathname) {
    case '/commission':
      pageName = "Commision Reports"
      break
    case '/team':
      pageName = "Team Reports"
      break
    case '/production':
      pageName = "Production Reports"
      break
    case '/':
      pageName = "Home"
      break
  }

  return (
    <HeaderContainer>
      <div  onClick={() => navigate('/') } name={'PROS'}>{auth.name} <span style={{fontSize: '12px',fontStyle:'italic'}}>({auth.rank}: {auth.username})</span> - {pageName}</div>

      <StatusContainer>
        <StatusDateTime><Liveclock /><StatusDotIcon fill={"#5CFD75"} /></StatusDateTime>
        <MenuIcon onClick={() => SetOpenMenu(!openMenu)} />
      </StatusContainer>
      {
        openMenu ?

        <Menu onMouseLeave={() => SetOpenMenu(false)}> 
            <MenuItem 
            onClick={() => navigate('/') }
            active={window.location.pathname === '/'}
            >Home</MenuItem>
            <MenuItem 
            onClick={() => navigate('/commission') }
            active={window.location.pathname === '/commission'}
            >Commision Reports</MenuItem>
            <MenuItem 
            onClick={() => navigate('/team') }
            active={window.location.pathname === '/team'}
            >Team Reports</MenuItem>
            <MenuItem 
            onClick={() => navigate('/production') }
            active={window.location.pathname === '/production'}
            >Production Reports</MenuItem>
            <MenuItem 
            onClick={() => logout() }
            >Logout</MenuItem>
        </Menu>
        :''
       }
    </HeaderContainer>
  )
}
