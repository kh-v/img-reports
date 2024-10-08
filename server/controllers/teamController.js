const fs = require('fs')
const _ = require('lodash')
const moment = require('moment-timezone')

const types = [
  'MD6',
  'MD5',
  'MD4',
  'MD3',
  'MD2',
  'MD1',
  'BASESHOP',
  'PERSONAL',
]

const getTeam = async (req, res) => {
  let { agentCode, dateFrom, dateTo } = req.query;
  dateFrom =  dateFrom ? /\d{4}-\d{2}-\d{2}/.test(dateFrom) ? moment(dateFrom,'YYYY-MM-DD') : null : null
  dateTo =  dateTo ? /\d{4}-\d{2}-\d{2}/.test(dateTo) ? moment(dateTo,'YYYY-MM-DD') : null : null

  let dir_path = `${__dirname}/../../storage/data/${agentCode}/team/reports`

  let data = {}
  if (fs.existsSync(dir_path)) {
    let years = fs.readdirSync(`${__dirname}/../../storage/data/${agentCode}/team/reports`)
    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      let months = fs.readdirSync(`${__dirname}/../../storage/data/${agentCode}/team/reports/${year}`)
      for (let ii = 0; ii < months.length; ii++) {
        const month = months[ii];
        for (let iii = 0; iii < types.length; iii++) {
          const type = types[iii];
          if (!data[type]) data[type] = []
          let p = `${__dirname}/../../storage/data/${agentCode}/team/reports/${year}/${month}/${type}.json`
          if (fs.existsSync(p)) {
            let d = JSON.parse(fs.readFileSync(p))
            d = d.filter(e => {
              const bd = moment(e.business_date, 'MM/DD/YYYY')
              let pass = true;
              if (dateFrom !== null) pass = pass && dateFrom <= bd
              if (dateTo !== null) pass = pass && dateTo >= bd
              return pass
            })
            data[type] = data[type] .concat(d)
          }
        }        
      }
    }
  }
  res.send(data)
}

const lastScan = async (req, res) => {
  let { agentCode } = req.query;

  let lastScanned = {}
  if (fs.existsSync(`${__dirname}/../../storage/models/lastScanned.json`)) {
    lastScanned = JSON.parse(fs.readFileSync(`${__dirname}/../../storage/models/lastScanned.json`).toString())
  }

  let d = lastScanned[agentCode] ? lastScanned[agentCode].team || null : null

  res.send({ d })
}

module.exports = {
  getTeam,
  lastScan
}
