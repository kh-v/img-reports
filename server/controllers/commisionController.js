const fs = require('fs')
const _ = require('lodash')
const moment = require('moment-timezone')

const getCommissions = async (req, res) => {
  let { agentCode, dateFrom, dateTo } = req.query;
  dateFrom =  dateFrom ? /\d{4}-\d{2}-\d{2}/.test(dateFrom) ? moment(dateFrom,'YYYY-MM-DD') : null : null
  dateTo =  dateTo ? /\d{4}-\d{2}-\d{2}/.test(dateTo) ? moment(dateTo,'YYYY-MM-DD') : null : null
  // agentCode = '450723PH'

  let dir_path = `${__dirname}/../../storage/data/${agentCode}/commission/reports`

  let data = []
  if (fs.existsSync(dir_path)) {
    let files = fs.readdirSync(`${__dirname}/../../storage/data/${agentCode}/commission/reports`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let date = moment(file.replace('.json', ''), 'YYYY-MM-DD')
      if (dateFrom > date && dateFrom !== null) continue
      if (dateTo < date && dateTo !== null) continue

      let d = JSON.parse(fs.readFileSync(`${dir_path}/${file}`).toString())
      d =  d.map(e => {
        e.reporting_date = file.replace('.json', '')
        return e
      })
      data = data.concat(d)
    }
  }
  console.log(data)
  res.send(data)
}

const getSummary = async (req, res) => {
  let { agentCode } = req.query;

  let dir_path = `${__dirname}/../../storage/data/${agentCode}/commission/reports`

  let data = []
  if (fs.existsSync(dir_path)) {
    let files = fs.readdirSync(`${__dirname}/../../storage/data/${agentCode}/commission/reports`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let d = JSON.parse(fs.readFileSync(`${dir_path}/${file}`).toString())
      d =  d.map(e => {
        e.reporting_date = file.replace('.json', '')
        return e
      })
      data = data.concat(d)
    }
  }

  let yearly = _.groupBy(data, d => moment(d.reporting_date, 'YYYY-MM-DD').format('YYYY'))
  yearly = _.mapValues(yearly, (grp,year) => {
    const premium = _.sumBy(grp, 'Premium')
    const gross = _.sumBy(grp, 'Gross')
    const wtax = _.sumBy(grp, 'WTax')
    const cbr = _.sumBy(grp, 'CBR')
    const net = _.sumBy(grp, 'NET')
    const chargers = _.sumBy(grp, e => e.NET <= 0 ? 0 : e.NET)
    return { year, premium, gross, wtax, cbr, net, chargers }
  })

  let monthly = _.groupBy(data, d => moment(d.reporting_date, 'YYYY-MM-DD').format('YYYY-MM'))
  monthly = _.mapValues(monthly, (grp, m) => {
    const premium = _.sumBy(grp, 'Premium')
    const gross = _.sumBy(grp, 'Gross')
    const wtax = _.sumBy(grp, 'WTax')
    const cbr = _.sumBy(grp, 'CBR')
    const net = _.sumBy(grp, 'NET')
    const chargers = _.sumBy(grp, e => e.NET > 0 ? 0 : e.NET)
    const mm = m.split('-')

    return { year: mm[0], month: mm[1], premium, gross, wtax, cbr, net, chargers }
  })

  let reporting_dates = _.groupBy(data, d => d.reporting_date)
  reporting_dates = _.mapValues(reporting_dates, (grp, m) => {
    const premium = _.sumBy(grp, 'Premium')
    const gross = _.sumBy(grp, 'Gross')
    const wtax = _.sumBy(grp, 'WTax')
    const cbr = _.sumBy(grp, 'CBR')
    const net = _.sumBy(grp, 'NET')
    const chargers = _.sumBy(grp, e => e.NET > 0 ? 0 : e.NET)

    return { date: m, premium, gross, wtax, cbr, net, chargers }
  })

  // console.log(yearly, monthly)
  
  res.send({ monthly, yearly, reporting_dates })
}

const getRateSummary = async (req, res) => {
  let { agentCode } = req.query;

  let dir_path = `${__dirname}/../../storage/data/${agentCode}/commission/reports`

  let data = []
  if (fs.existsSync(dir_path)) {
    let files = fs.readdirSync(`${__dirname}/../../storage/data/${agentCode}/commission/reports`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let d = JSON.parse(fs.readFileSync(`${dir_path}/${file}`).toString())
      d =  d.map(e => {
        e.reporting_date = file.replace('.json', '')
        return e
      })
      data = data.concat(d)
    }
  }

  data = data.filter(d => d.Rate > 0)
  let rates = _.groupBy(data,'Rate')
  rates = _.mapValues(rates, _data => {

    let yearly = _.groupBy(_data, d => moment(d.reporting_date, 'YYYY-MM-DD').format('YYYY'))
    yearly = _.mapValues(yearly, (grp,year) => {
      const premium = _.sumBy(grp, 'Premium')
      const gross = _.sumBy(grp, 'Gross')
      const wtax = _.sumBy(grp, 'WTax')
      const cbr = _.sumBy(grp, 'CBR')
      const net = _.sumBy(grp, 'NET')
      return { year, premium, gross, wtax, cbr, net }
    })
  
    let monthly = _.groupBy(_data, d => moment(d.reporting_date, 'YYYY-MM-DD').format('YYYY-MM'))
  
    monthly = _.mapValues(monthly, (grp, m) => {
      const premium = _.sumBy(grp, 'Premium')
      const gross = _.sumBy(grp, 'Gross')
      const wtax = _.sumBy(grp, 'WTax')
      const cbr = _.sumBy(grp, 'CBR')
      const net = _.sumBy(grp, 'NET')
      const mm = m.split('-')
  
      return { year: mm[0], month: mm[1], premium, gross, wtax, cbr, net }
    })

    let reporting_dates = _.groupBy(_data, d => d.reporting_date)
    reporting_dates = _.mapValues(reporting_dates, (grp, m) => {
      const premium = _.sumBy(grp, 'Premium')
      const gross = _.sumBy(grp, 'Gross')
      const wtax = _.sumBy(grp, 'WTax')
      const cbr = _.sumBy(grp, 'CBR')
      const net = _.sumBy(grp, 'NET')
      return { date: m, premium, gross, wtax, cbr, net }
    })

    return { monthly, yearly, reporting_dates }
  })

  
  res.send(rates)

}

module.exports = {
  getCommissions,
  getRateSummary,
  getSummary
}