const _ = require('lodash')
const fs = require('fs')
const moment = require('moment-timezone')
const DIR = `${__dirname}/../../storage/models/users.json`;

const getAllUsers = () => {
  let users = []
  if (fs.existsSync(DIR)) {
    users =  JSON.parse(fs.readFileSync(DIR)) 
  } 
  return users
}

const getUser = async (username) => {
  const users = getAllUsers()
  const user = _.find(users, u => u.username.toLowerCase() === username.toLowerCase()) || null
  return user
}

const getUserByRefreshToken = async (token) => {
  const users = getAllUsers()
  const user = _.find(users, u => u.token === token) || null
  return user
}

const updateUser = async (username, token) => {
  const users = getAllUsers()
  const userIndex = _.findIndex(users, u => u.username.toLowerCase() === username.toLowerCase()) 
  if (userIndex !== -1) {
    users[userIndex].refresh_token = token
    users[userIndex].updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss A Z')
    fs.writeFileSync(DIR, JSON.stringify(users, null, 4))
    return true
  } else {
    return false
  }
}

const updateUserData = async (username, data={}) => {
  const users = getAllUsers()
  const userIndex = _.findIndex(users, u => u.username.toLowerCase() === username.toLowerCase()) 
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...data
    }
    fs.writeFileSync(DIR, JSON.stringify(users, null, 4))
    return true
  } else {
    return false
  }
}

const insertUser = async (user) => {
  const users = getAllUsers()
  const userIndex = _.findIndex(users, u => u.username.toLowerCase() === user.username.toLowerCase()) 
  if (userIndex === -1) {
    user.created_at = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss A Z')
    users.push(user)
    fs.writeFileSync(DIR, JSON.stringify(users, null, 4))
    return true
  } else {
    return false
  }
}

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  insertUser,
  getUserByRefreshToken,
  updateUserData
}