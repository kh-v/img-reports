const fs = require('fs');
const moment = require('moment-timezone');
const { logEvents } = require('../middleware/logEvents');
const {
  updateCommissionReportsTask,
  updateProductionReportsTask,
  updateTeamReportsTask,
  recheckInvalidImgCredentials
} = require('./tasks');
const { split } = require('lodash');


const updateCommissionsReportJob = async () => {
  logEvents('Start Update Commission Reports','run.log')
  await updateCommissionReportsTask()
}

const updateTeamReportJobs = async () => {
  logEvents('Start Update Team Reports','run.log')
  await updateTeamReportsTask()
}

const updateProductionReportJob = async () => {
  logEvents('Start Update Production Reports','run.log')
  await updateProductionReportsTask()
}

const recheckInvalidImgCredentialsJob = async () => {
  logEvents('Recheck Invalid Img Credentials','run.log')
  await recheckInvalidImgCredentials()
}


(async () => {
  let d = process.argv
  if (d[2]) {
    let t = /\-\-([a-zA-Z0-9]+)/gi.exec(d[2])
    if (t) {
      try {
        console.log(t[1].toLowerCase())
        switch(t[1].toLowerCase()) {
          case 'commission':
              await updateCommissionsReportJob();
              break
          case 'production':
              await updateProductionReportJob();
              break
          case 'team':
              await updateTeamReportJobs();
              break
          case 'cred':
              await recheckInvalidImgCredentialsJob();
              break
          default:
            //
          }
      } catch (error) {
        console.log(error)
      }
    }
  }
})()