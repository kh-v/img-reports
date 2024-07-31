import React, { useContext, useEffect, useState } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')))
  const [activeAgent, setAgent] = useState(JSON.parse(localStorage.getItem('agent')))
  const [users, setUsers] = useState([])

  const setActiveAgent = (agent) => {
    setAgent({...agent});
    localStorage.setItem('agent',JSON.stringify(agent))
  }

  const setUserAuth = (data) => {
    console.log(data)
    setAuth({...data});
    localStorage.setItem('auth',JSON.stringify(data))
    setActiveAgent({ username: data.username, name: data.name, rank: data.rank })
  }

  const logout = () => {
    setAuth(null);
    setAgent(null);
    setUsers([])
    localStorage.removeItem('auth')
    localStorage.removeItem('agent')
  }

  useEffect(() => {
    // let user = localStorage.getItem('user')
    // if (user) {
    //   setCurrentUser(user)
    // }

  }, [])



  console.log(auth)

  const value = {
    auth,
    setUserAuth,
    logout,
    setActiveAgent,
    activeAgent,
    users,
    setUsers
  }

  return (
    <AuthContext.Provider value={value} >
      { children }
    </AuthContext.Provider>
  )

}