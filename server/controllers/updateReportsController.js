const fs = require('fs')
const _ = require('lodash')
const moment = require('moment-timezone')
const { updateReports } = require('../../backend/scanner')
const {
  getUser
} = require('../model/users')

const {
  decrypt
} = require('../utils/crypto')

const updateCommissionReports = async (req, res) => {
  let { agentCode } = req.query;
  let user = await getUser(agentCode)
  // users = users.filter(d => d.username === agentCode)
  // let user = users.length > 0 ? users[0] : null
  if (user) {
    try {
      const password =  decrypt(user.img_password)
      await updateReports(user.username, password, 'commission')
      res.send({ message: 'Done' })
    } catch (error) {
      res.send({ message: error.message })
    }

  } else (
    res.send({ message: 'No User Found' })
  )
}

const updateTeamReports = async (req, res) => {
  let { agentCode } = req.query;
  let user = await getUser(agentCode)
  // let users = JSON.parse(fs.readFileSync(`${__dirname}/../model/img_users.json`).toString())
  // users = users.filter(d => d.username === agentCode)
  // let user = users.length > 0 ? users[0] : null
  if (user) {
    try {
      const password =  decrypt(user.img_password)
      await updateReports(user.username, password, 'team')
      res.send({ message: 'Done' })
    } catch (error) {
      res.send({ message: error.message })
    }

  } else (
    res.send({ message: 'No User Found' })
  )
}

const updateProductionReports = async (req, res) => {
  let { agentCode } = req.query;
  let user = await getUser(agentCode)
  // let users = JSON.parse(fs.readFileSync(`${__dirname}/../model/img_users.json`).toString())
  // users = users.filter(d => d.username === agentCode)
  // let user = users.length > 0 ? users[0] : null
  if (user) {
    try {
      const password =  decrypt(user.img_password)
      await updateReports(user.username, password, 'production')
      res.send({ message: 'Done' })
    } catch (error) {
      res.send({ message: error.message })
    }

  } else (
    res.send({ message: 'No User Found' })
  )
}

module.exports = {
  updateCommissionReports,
  updateProductionReports,
  updateTeamReports
}