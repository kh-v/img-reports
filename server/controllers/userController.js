const userModel = require('../model/users')

const {
  encrypt
} = require('../utils/crypto')

const {
  loginCookies
} = require('../../backend/scanner')


const updateUser = async (req, res) => {
  const { username, img_password } = req.body;
  let user = await userModel.getUser(username)

  if (user) {
    let user_update = await loginCookies(username, img_password)
    if (user_update) {
      user = {
        ...user,
        ...user_update,
        img_password: encrypt(img_password)
      }

      await userModel.updateUserData(user)
      res.status(201).json({ 'success': `IMG credential updated` });
    } else {
      res.status(401).json({ 'message': 'Invalid IMG credential' });
    }
  }

  res.status(500);
}

const getAllUsers = async (req, res) => {
  const { username } = req.query;
  let user = await userModel.getUser(username)
  if (user) {

    if (user.admin) {
      let users = await userModel.getAllUsers()
      users = users.map(e => {
        return {
          username: e.username,
          name: e.name,
          rank: e.rank
        }
      })
    
      res.status(201).json(users)
    } else {
      res.status(401).json({ 'message': 'Unauthorized' });
    }
  }

  res.status(500);
}

module.exports = { 
  updateUser,
  getAllUsers
};