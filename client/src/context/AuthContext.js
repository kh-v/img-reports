import React, { useContext, useEffect, useState } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('auth')))

  const setUserAuth = (data) => {
    console.log(data)
    setAuth({...data});
    localStorage.setItem('auth',JSON.stringify(data))
  }

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth')
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
  }

  return (
    <AuthContext.Provider value={value} >
      { children }
    </AuthContext.Provider>
  )

}