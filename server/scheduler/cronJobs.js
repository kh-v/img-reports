const fs = require('fs');
const { CronJob } = require('cron');
const moment = require('moment-timezone');
const { logEvents } = require('../middleware/logEvents');
const {
  updateCommissionReportsTask,
  updateProductionReportsTask,
  updateTeamReportsTask,
  recheckInvalidImgCredentials
} = require('./tasks')

const updateCommissionsReportJob = CronJob.from({
  cronTime: '0 0,6,12,18 * * *',
  onTick: async () => {
    logEvents('Start Update Commission Reports','scheduler.log')
    updateCommissionReportsTask()
  },
  start: true,
  timeZone: 'Asia/Manila'
});

const updateTeamReportJobs = CronJob.from({
  cronTime: '0 0,6,12,18 * * *',
  onTick: async () => {
    logEvents('Start Update Team Reports','scheduler.log')
    updateTeamReportsTask()
  },
  start: true,
  timeZone: 'Asia/Manila'
});

const updateProductionReportJob = CronJob.from({
  cronTime: '0 0,6,12,18 * * *',
  onTick: async () => {
    logEvents('Start Update Production Reports','scheduler.log')
    updateProductionReportsTask()
  },
  start: true,
  timeZone: 'Asia/Manila'
});

const recheckInvalidImgCredentialsJob = CronJob.from({
  cronTime: '0 5,12,17,23 * * *',
  onTick: async () => {
    logEvents('Recheck Invalid Img Credentials','scheduler.log')
    recheckInvalidImgCredentials()
  },
  start: true,
  timeZone: 'Asia/Manila'
});