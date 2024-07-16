import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function PrivateRoutes() {
  const { auth } = useAuth()
  // const currentUser = 'test'
  // console.log(currentUser)

  return auth ? <Outlet /> : <Navigate to="/login"   replace={true}/>
}
