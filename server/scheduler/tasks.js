const fs = require('fs');
const moment = require('moment-timezone');
const { logEvents } = require('../middleware/logEvents');

const {
  getAllUsers, getUser, updateUserData
} = require('../model/users')

const {
  decrypt
} = require('../utils/crypto')

const {
  updateReports,
  loginCookies
} = require('../../backend/scanner')

let commissionTaskStatus = {}
let teamTaskStatus = {}
let productionTaskStatus = {}

const updateCommissionReportsTask = async (username=null) => {
  let users = await getAllUsers()
  if (username) {
    users = users.filter(u => u.username.toUpperCase() === username.toUpperCase())
  }

  let date = moment().tz('Asia/Manila')
  let year = date.format('YYYY')
  let month = date.format('MM')
  let last_of_month = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month').format('DD')

  if (date < moment(`${year}-${month}-08`, 'YYYY-MM-DD')) {
    let _date = `${year}-${month}-08`
    date = moment(_date, 'YYYY-MM-DD')
  } else if (date < moment(`${year}-${month}-15`, 'YYYY-MM-DD'))  {
      let _date = `${year}-${month}-15`
      date = moment(_date, 'YYYY-MM-DD')
  } else if (date < moment(`${year}-${month}-22`, 'YYYY-MM-DD'))  {
      let _date = `${year}-${month}-22`
      date = moment(_date, 'YYYY-MM-DD')
  } else if (date < moment(`${year}-${month}-${last_of_month}`, 'YYYY-MM-DD'))  {
      let _date = `${year}-${month}-${last_of_month}`
      date = moment(_date, 'YYYY-MM-DD')
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    logEvents(`[commission] ${user.username} - Start Checking`,'task.log')
    if (!user.invalid_img_credential) {
      let username = user.username.toUpperCase()
      if (!commissionTaskStatus[username]) {
        let details_path = `${__dirname}/../../storage/data/${username}/commission/details.json`
        if (fs.existsSync(details_path)) {
          let last_update = moment(JSON.parse(fs.readFileSync(details_path)).last_report,'YYYY-MM-DD')
          if (date > last_update) {
            let password = decrypt(user.img_password)

            const promise = () => {
              return new Promise(async (resolve) => {
                commissionTaskStatus[username] = true
                await updateReports(username, password, 'commission')
                commissionTaskStatus[username] = false
                logEvents(`[commission] ${user.username} - Done Checking`,'task.log')
                resolve()
              })
            }
            promise()
          } else {
            logEvents(`[commission] ${user.username} - Already Up to Date`,'task.log')
          }
        } else {
          logEvents(`[commission] ${user.username} - Dir Does Not Exists`,'taskErr.log')
        }
      } else {
        logEvents(`[commission] ${user.username} - Another Task Ongoing`,'task.log')
      }
    } else {
      logEvents(`[commission] ${user.username} - Invalid IMG Credential`,'taskErr.log')
    }
  }
}

const updateTeamReportsTask =  async (username=null) => {
  let users = await getAllUsers()
  if (username) {
    users = users.filter(u => u.username.toUpperCase() === username.toUpperCase())
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    logEvents(`[team] ${user.username} - Start Checking`,'task.log')
    if (!user.invalid_img_credential) {
      let username = user.username.toUpperCase()
      if (!teamTaskStatus[username]) {
        let password = decrypt(user.img_password)

        const promise = () => {
          return new Promise(async (resolve) => {
            teamTaskStatus[username] = true
            await updateReports(username, password, 'team')
            teamTaskStatus[username] = false
            logEvents(`[team] ${user.username} - Done Checking`,'task.log')
            resolve()
          })
        }
        promise()
      } else {
        logEvents(`[team] ${user.username} - Another Task Ongoing`,'task.log')
      }
    } else {
      logEvents(`[team] ${user.username} - Invalid IMG Credential`,'taskErr.log')
    }
  }
}

const updateProductionReportsTask =  async (username=null) => {
  let users = await getAllUsers()
  if (username) {
    users = users.filter(u => u.username.toUpperCase() === username.toUpperCase())
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    logEvents(`[production] ${user.username} - Start Checking`,'task.log')
    if (!user.invalid_img_credential) {
      let username = user.username.toUpperCase()
      if (!productionTaskStatus[username]) {
        let password = decrypt(user.img_password)
        const promise = () => {
          return new Promise(async (resolve) => {
            productionTaskStatus[username] = true
            await updateReports(username, password, 'production')
            productionTaskStatus[username] = false
            logEvents(`[production] ${user.username} - Done Checking`,'task.log')
            resolve()
          })
        }
        promise()
      } else {
        logEvents(`[production] ${user.username} - Another Task Ongoing`,'task.log')
      }
    } else {
      logEvents(`[production] ${user.username} - Invalid IMG Credential`,'taskErr.log')
    }
  }
}


const recheckInvalidImgCredentials =  async () => {
  let users = await getAllUsers()
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if (user) {
      if (user.invalid_img_credential && user.creds_failed < 3) {
        logEvents(`[recheck IMG creds] ${user.username} - Start Checking`,'task.log')
        if (user.creds_failed === undefined) user.creds_failed = 0
        const password =  decrypt(user.img_password)
        let res = await loginCookies(user.username, password)
        if (!res) {
          updateUserData(user.username, { creds_failed: user.creds_failed + 1 })
          logEvents(`[recheck IMG creds] ${user.username} - Credential Failed (tries: ${user.creds_failed + 1 })`,'task.log')
        } else {
          updateUserData(user.username, { invalid_img_credential: false })
          logEvents(`[recheck IMG creds] ${user.username} - Credential Passed`,'task.log')
        }
        logEvents(`[recheck IMG creds] ${user.username} - Done Checking`,'task.log')
      } else {
        if (user.creds_failed  > 0 || user.creds_failed === undefined) {
          updateUserData(user.username, { creds_failed: 0 })
        }
      }
    }
  }
}

module.exports = {
  updateCommissionReportsTask,
  updateTeamReportsTask,
  updateProductionReportsTask,
  recheckInvalidImgCredentials
}