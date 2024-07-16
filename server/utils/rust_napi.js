const API = require('../../rust_napi/index.js')

const compareTechnical = (date) => {
  return API.compareTechnical(date)
}

const getTechnical = (date,ticker) => {
  return API.getTechnical(date,ticker)
}

module.exports = {
  compareTechnical,
  getTechnical
}