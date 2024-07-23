const {
  getUser,
  updateUserData
} = require('../model/users')

const {
  encrypt
} = require('../utils/crypto')

const {
  loginCookies
} = require('../../backend/scanner')


const updateUser = async (req, res) => {
  const { username, img_password } = req.body;
  let user = await getUser(username)

  if (user) {
    let user_update = await loginCookies(username, img_password)
    if (user_update) {
      user = {
        ...user,
        ...user_update,
        img_password: encrypt(img_password)
      }

      await updateUserData(user)
      res.status(201).json({ 'success': `IMG credential updated` });
    } else {
      res.status(401).json({ 'message': 'Invalid IMG credential' });
    }
  }

  res.status(500);
}

module.exports = { updateUser };