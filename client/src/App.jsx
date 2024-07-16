import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'
import PrivateRoutes from './PrivateRoutes';

import Header from './components/header/header.component';
// import Login from './components/login/login.component';

import Commission from './components/commission/commission.component';

import {
  AppContainer
} from './App.style'

function App() {
  const navigate = useNavigate();
  const [openSettings, SetOpenSetting] = useState(null)
  const [layout, SetLayout] = useState(1)
  const [user, SetUser] = useState(null);

  useEffect(() => {
    let u = localStorage.getItem('user');
    if (!user) {
      SetUser(u);
    }
  }, [])
  return (
    <AppContainer>
      <AuthProvider>
        <Routes>
          <Route exact  path="/login"  element={ <div></div>} />
          <Route exact path="/commission"  element={
              <div>
                <Header name={'KHLAB'} 
                  SetOpenSetting={SetOpenSetting}
                  layout={layout}
                  SetLayout={SetLayout} 
                  SetUser={SetUser}
                  />
                <Commission />
              </div>
            } />
        </Routes>
      </AuthProvider>
    </AppContainer>
  );
}

export default App;
