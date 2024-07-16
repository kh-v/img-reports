const { pool } = require('../utils/PostgreSQL')

const getUser = async (username) => {
  let user = null;
  await pool.query(`
    SELECT * FROM pros_alert_app_users
    WHERE username = '${username}'
  
  `)
  .then(res => {
    if (res.rows.length > 0) {
      user = res.rows[0]
    }
  })

  return user
}
const getUserByRefreshToken = async (token) => {
  let user = null;
  await pool.query(`
    SELECT * FROM pros_alert_app_users
    WHERE refresh_token = '${token}'
  
  `)
  .then(res => {
    if (res.rows.length > 0) {
      user = res.rows[0]
    }
  })

  return user
}

const updateUser = async (username, token) => {
  await pool.query(`
    UPDATE pros_alert_app_users
    SET 
      refresh_token = '${token}',
      updated_at = NOW()
    WHERE username = '${username}'
  `)
  .then(res => {

  })

  return true
}

const insertUser = async (username, password) => {
  await pool.query(`
    INSERT INTO pros_alert_app_users (username,password,created_at)
    VALUES ('${username}','${password}', NOW())
  `)
  .then(res => {

  })

  return true
}

module.exports = {
  getUser,
  updateUser,
  insertUser,
  getUserByRefreshToken
}