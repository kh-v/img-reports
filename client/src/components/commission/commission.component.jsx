import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import useAxiosPrivate from '../../api/useAxiosPrivate'
import _ from 'lodash'
import moment from 'moment-timezone'

import {
  CommissionContainer,
  TableContainer,
  TableTitle,
  DataTable,
  TableHeaders,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,

  TypeContainer,
  TypeBtn,

  CommissionListContainer,
  CommissionListDateFilters,
  CommissionListDateBtn,
  CommissionListFilters
} from './commission.style'

const {
  REACT_APP_SERVER
} = process.env;


const Round = (num,dec=2) => {
  let _num = !isNaN(parseFloat(num)) ? parseFloat(Math.round(num*Math.pow(10,dec))/Math.pow(10,dec)).toString():'';
  _num = dec === 0 ? 
    _num.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    :`${_num.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${_num.split('.')[1] ? `.${_num.split('.')[1]}000000`.substring(0,dec+1):'.000000'.substring(0,dec+1)}`
  return  _num;
}


export default function Commission() {
  const { auth, activeAgent } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [yearlySummary, SetYearlySummary] = useState([])
  const [montlySummary, SetMonthlySummary] = useState([])
  const [reportingDatesSummary, SetReportingDatesSummary] = useState([])
  const [rateSummary, SetRateSummary] = useState([])
  const [commissionList, SetCommissionList] = useState([])
  const [type, SetType] = useState('yearly')
  const [activeDateFilter, SetActiveDateFilter] = useState('30D')

  const [listFilters, SetListFilters] = useState({
    dateFrom: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    dateTo: moment().format('YYYY-MM-DD'),
    date: 'all',
    agent: 'all',
    buss_type: 'all',
    rate: 'all',
    keyword: ''
  })

  const getCommissionSummary = (agentCode) => {
    axiosPrivate.get(`${REACT_APP_SERVER}/commission/get_summary\?agentCode\=${agentCode}`)
    .then(res => {
      let { yearly, monthly, reporting_dates } =  res.data

      yearly = _.toArray(yearly)
      yearly.reverse()
      SetYearlySummary(yearly)
      monthly = _.toArray(monthly)
      monthly.reverse()
      SetMonthlySummary(monthly)
      reporting_dates = _.toArray(reporting_dates)
      reporting_dates.reverse()
      SetReportingDatesSummary(reporting_dates)
    })
    .catch(err => {

    })
  }

  const getRateCommissionSummary = (agentCode) => {
    axiosPrivate.get(`${REACT_APP_SERVER}/commission/get_rate_summary\?agentCode\=${agentCode}`)
    .then(res => {
      let rates = _.mapValues(res.data, (d,r) => {
        let { yearly, monthly, reporting_dates } =  d
        yearly = _.toArray(yearly)
        monthly = _.toArray(monthly)
        reporting_dates = _.toArray(reporting_dates)
        yearly.reverse()
        monthly.reverse()
        reporting_dates.reverse()
        
        return {
          rate: parseFloat(r),
          yearly,
          monthly, 
          reporting_dates
        }
      })

      rates = _.toArray(rates)
      rates = _.orderBy(rates, 'rate', 'desc')
      SetRateSummary(rates)
      
    })
    .catch(err => {

    })
  }

  const getCommissionList = (agentCode, dateFrom,dateTo) => {
    axiosPrivate.get(`${REACT_APP_SERVER}/commission/get_commissions\?agentCode\=${agentCode}&dateFrom=${dateFrom}&dateTo=${dateTo}`)
    .then(res => {
    //  console.log(res.data)
     SetCommissionList(res.data)
      
    })
    .catch(err => {

    })
  }



  useEffect(() => {
    getCommissionSummary(activeAgent.username)
    getRateCommissionSummary(activeAgent.username)
    getCommissionList(activeAgent.username, listFilters.dateFrom, listFilters.dateTo)
  }, [])

  let filterOptions = {
    dates: _.uniq(_.map(commissionList, 'reporting_date')),
    types: _.uniq(_.map(commissionList, 'Buss Type')),
    agents: _.uniq(_.map(commissionList, 'Agent Name')),
    rates: _.uniq(_.map(commissionList, 'Rate')),
  }

  console.log(filterOptions)

  const filteredCommissionList =  commissionList.filter(e => {
    if (listFilters.date !== 'all' && listFilters.date !== e.reporting_date) return false
    if (listFilters.agent !== 'all' && listFilters.agent !== e['Agent Name']) return false
    if (listFilters.buss_type !== 'all' && listFilters.buss_type !== e['Buss Type']) return false
    if (listFilters.rate !== 'all' && parseFloat(listFilters.rate) !== parseFloat(e['Rate'])) return false
    if (listFilters.keyword.trim() !== '' && e['Name of Insure'].toLowerCase().indexOf(listFilters.keyword.toLowerCase().trim()) === -1) return false
    return true
  })

  return (
    <CommissionContainer>
      <TypeContainer>
        <TypeBtn active={type === 'yearly'} onClick={() => SetType('yearly')}>Yearly</TypeBtn>
        <TypeBtn active={type === 'monthly'} onClick={() => SetType('monthly')}>Monthly</TypeBtn>
        <TypeBtn active={type === 'report_date'} onClick={() => SetType('report_date')}>Report Dates</TypeBtn>
        <TypeBtn active={type === 'list'} onClick={() => SetType('list')}>Commission List</TypeBtn>
      </TypeContainer>
      {
        type === 'yearly' ?
        <TableContainer>
          <TableTitle>Yearly Reports</TableTitle>
          <DataTable>
            <TableHeaders>
              <TableHeader>Year</TableHeader>
              <TableHeader>Premium</TableHeader>
              <TableHeader>Gross</TableHeader>
              <TableHeader>W-Tax</TableHeader>
              <TableHeader>CBR</TableHeader>
              <TableHeader>Charges</TableHeader>
              <TableHeader>NET</TableHeader>
            </TableHeaders>
            <TableBody>
                {
                  yearlySummary.map(e => (
                    <TableRow>
                      <TableCell>{e.year}</TableCell>  
                      <TableCell>{Round(e.premium, 2)}</TableCell> 
                      <TableCell>{Round(e.gross, 2)}</TableCell> 
                      <TableCell>{Round(e.wtax, 2)}</TableCell> 
                      <TableCell>{Round(e.cbr, 2)}</TableCell> 
                      <TableCell>{Round(e.chargers, 2)}</TableCell> 
                      <TableCell>{Round(e.net, 2)}</TableCell> 
                    </TableRow>
                  ))
                }
            </TableBody>

          </DataTable>
        </TableContainer>
        :''
      }
      {
        type === 'monthly' ?
        <TableContainer>
          <TableTitle>Monthly Reports</TableTitle>
          <DataTable>
            <TableHeaders>
              <TableHeader>Month</TableHeader>
              <TableHeader>Premium</TableHeader>
              <TableHeader>Gross</TableHeader>
              <TableHeader>W-Tax</TableHeader>
              <TableHeader>CBR</TableHeader>
              <TableHeader>Charges</TableHeader>
              <TableHeader>NET</TableHeader>
            </TableHeaders>
            <TableBody>
                {
                  montlySummary.map(e => (
                    <TableRow>
                      <TableCell>{moment(e.month,'MM').format('MMMM')} {e.year}</TableCell>  
                      <TableCell>{Round(e.premium, 2)}</TableCell> 
                      <TableCell>{Round(e.gross, 2)}</TableCell> 
                      <TableCell>{Round(e.wtax, 2)}</TableCell> 
                      <TableCell>{Round(e.cbr, 2)}</TableCell> 
                      <TableCell>{Round(e.chargers, 2)}</TableCell> 
                      <TableCell>{Round(e.net, 2)}</TableCell> 
                    </TableRow>
                  ))
                }
            </TableBody>
          </DataTable>
        </TableContainer>
        :''
      }
      {
        type === 'report_date' ?
        <TableContainer>
          <TableTitle>Reports</TableTitle>
          <DataTable>
            <TableHeaders>
              <TableHeader>Date</TableHeader>
              <TableHeader>Premium</TableHeader>
              <TableHeader>Gross</TableHeader>
              <TableHeader>W-Tax</TableHeader>
              <TableHeader>CBR</TableHeader>
              <TableHeader>Charges</TableHeader>
              <TableHeader>NET</TableHeader>
            </TableHeaders>
            <TableBody>
                {
                  reportingDatesSummary.map(e => (
                    <TableRow>
                      <TableCell>{moment(e.date,'YYYY-MM-DD').format('MMMM D, YYYY')}</TableCell>  
                      <TableCell>{Round(e.premium, 2)}</TableCell> 
                      <TableCell>{Round(e.gross, 2)}</TableCell> 
                      <TableCell>{Round(e.wtax, 2)}</TableCell> 
                      <TableCell>{Round(e.cbr, 2)}</TableCell> 
                      <TableCell>{Round(e.chargers, 2)}</TableCell> 
                      <TableCell>{Round(e.net, 2)}</TableCell> 
                    </TableRow>
                  ))
                }
            </TableBody>
          </DataTable>
        </TableContainer>
        :''
      }
      {
        rateSummary.map(r => (
          <div>
            {
              type === 'yearly' ?
              <TableContainer>
                <TableTitle>{Round(r.rate*100,2
                  )}% Yearly Reports</TableTitle>
                <DataTable>
                  <TableHeaders>
                    <TableHeader>Year</TableHeader>
                    <TableHeader>Premium</TableHeader>
                    <TableHeader>Gross</TableHeader>
                    <TableHeader>W-Tax</TableHeader>
                    <TableHeader>CBR</TableHeader>
                    <TableHeader>NET</TableHeader>
                  </TableHeaders>
                  <TableBody>
                      {
                        r.yearly.map(e => (
                          <TableRow>
                            <TableCell>{e.year}</TableCell>  
                            <TableCell>{Round(e.premium, 2)}</TableCell> 
                            <TableCell>{Round(e.gross, 2)}</TableCell> 
                            <TableCell>{Round(e.wtax, 2)}</TableCell> 
                            <TableCell>{Round(e.cbr, 2)}</TableCell> 
                            <TableCell>{Round(e.net, 2)}</TableCell> 
                          </TableRow>
                        ))
                      }
                  </TableBody>

                </DataTable>
              </TableContainer>
              :''
            }
            {
              type === 'monthly' ?
              <TableContainer>
                <TableTitle>{Round(r.rate*100,2
                  )}% Monthly Reports</TableTitle>
                <DataTable>
                  <TableHeaders>
                    <TableHeader>Month</TableHeader>
                    <TableHeader>Premium</TableHeader>
                    <TableHeader>Gross</TableHeader>
                    <TableHeader>W-Tax</TableHeader>
                    <TableHeader>CBR</TableHeader>
                    <TableHeader>NET</TableHeader>
                  </TableHeaders>
                  <TableBody>
                      {
                        r.monthly.map(e => (
                          <TableRow>
                            <TableCell>{moment(e.month,'MM').format('MMMM')} {e.year}</TableCell>  
                            <TableCell>{Round(e.premium, 2)}</TableCell> 
                            <TableCell>{Round(e.gross, 2)}</TableCell> 
                            <TableCell>{Round(e.wtax, 2)}</TableCell> 
                            <TableCell>{Round(e.cbr, 2)}</TableCell> 
                            <TableCell>{Round(e.net, 2)}</TableCell> 
                          </TableRow>
                        ))
                      }
                  </TableBody>
                </DataTable>
              </TableContainer>
              :''
            }
            {
              type === 'report_date' ?
              <TableContainer>
                <TableTitle>{Round(r.rate*100,2
                  )}% Reports</TableTitle>
                <DataTable>
                  <TableHeaders>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Premium</TableHeader>
                    <TableHeader>Gross</TableHeader>
                    <TableHeader>W-Tax</TableHeader>
                    <TableHeader>CBR</TableHeader>
                    <TableHeader>NET</TableHeader>
                  </TableHeaders>
                  <TableBody>
                      {
                        r.reporting_dates.map(e => (
                          <TableRow>
                            <TableCell>{moment(e.date,'YYYY-MM-DD').format('MMMM D, YYYY')}</TableCell>  
                            <TableCell>{Round(e.premium, 2)}</TableCell> 
                            <TableCell>{Round(e.gross, 2)}</TableCell> 
                            <TableCell>{Round(e.wtax, 2)}</TableCell> 
                            <TableCell>{Round(e.cbr, 2)}</TableCell> 
                            <TableCell>{Round(e.net, 2)}</TableCell> 
                          </TableRow>
                        ))
                      }
                  </TableBody>
                </DataTable>
              </TableContainer>
              :''
            }

          </div>
        ))
      }
      {
        type === 'list' ?
        <CommissionListContainer>
          <CommissionListDateFilters>
            <CommissionListDateBtn active={activeDateFilter === '30D'} onClick={() => {
              let dateFrom = moment().subtract(30,'days').format('YYYY-MM-DD')
              let dateTo = moment().format('YYYY-MM-DD')
              SetListFilters({
                ...listFilters,
                dateFrom,
                dateTo
              })
              getCommissionList(activeAgent.username, dateFrom, dateTo)
              SetActiveDateFilter('30D')
            }}>Last 30 Days</CommissionListDateBtn>
            <CommissionListDateBtn active={activeDateFilter === '60D'} onClick={() => {
              let dateFrom = moment().subtract(60,'days').format('YYYY-MM-DD')
              let dateTo = moment().format('YYYY-MM-DD')
              SetListFilters({
                ...listFilters,
                dateFrom,
                dateTo
              })
              getCommissionList(activeAgent.username, dateFrom, dateTo)
              SetActiveDateFilter('60D')
            }}>Last 60 Days</CommissionListDateBtn>
            <CommissionListDateBtn active={activeDateFilter === '90D'} onClick={() => {
              let dateFrom = moment().subtract(90,'days').format('YYYY-MM-DD')
              let dateTo = moment().format('YYYY-MM-DD')
              SetListFilters({
                ...listFilters,
                dateFrom,
                dateTo
              })
              getCommissionList(activeAgent.username, dateFrom, dateTo)
              SetActiveDateFilter('90D')
            }}>Last 90 Days</CommissionListDateBtn>
            <CommissionListDateBtn active={activeDateFilter === 'Y'} onClick={() => {
              let dateFrom = moment().startOf('year').format('YYYY-MM-DD')
              let dateTo = moment().format('YYYY-MM-DD')
              SetListFilters({
                ...listFilters,
                dateFrom,
                dateTo
              })
              getCommissionList(activeAgent.username, dateFrom, dateTo)
              SetActiveDateFilter('Y')
            }}>This Year</CommissionListDateBtn>
            <CommissionListDateBtn active={activeDateFilter === 'LY'} onClick={() => {
              let dateFrom = moment().subtract(1,'year').startOf('year').format('YYYY-MM-DD')
              let dateTo = moment().subtract(1,'year').endOf('year').format('YYYY-MM-DD')
              SetListFilters({
                ...listFilters,
                dateFrom,
                dateTo
              })
              getCommissionList(activeAgent.username, dateFrom, dateTo)
              SetActiveDateFilter('LY')
            }}>Last Year</CommissionListDateBtn>
            <CommissionListDateBtn active={false} onClick={() => {
              
            }}>Custom</CommissionListDateBtn>
          </CommissionListDateFilters>
          <CommissionListFilters>
            <div>
              Search Name
              <input placeholder='Keyword' value={listFilters.keyword} onChange={el => SetListFilters({ ...listFilters, keyword: el.target.value}) } />
            </div>
            <div>
              Reporting Date 
              <select onChange={el => SetListFilters({ ...listFilters, date:  el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.dates.map(d => <option value={d}>{moment(d,'YYYY-MM-DD').format('MMMM D, YYYY')}</option>)
                }
              </select>
            </div>
            <div>
              Agent
              <select onChange={el => SetListFilters({ ...listFilters, agent:  el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.agents.map(d => <option value={d}>{d}</option>)
                }
              </select>
            </div>
            <div>
              Buss Type
              <select onChange={el => SetListFilters({ ...listFilters, buss_type:  el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.types.map(d => <option value={d}>{d}</option>)
                }
              </select>
            </div>
            <div>
              Rate
              <select onChange={el => SetListFilters({ ...listFilters, rate: el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.rates.map(d => <option value={d}>{Round(d*100,2)}%</option>)
                }
              </select>
            </div>
          </CommissionListFilters>

          <TableContainer>
            <DataTable>
              <TableHeaders>
                <TableHeader>Reporting Date</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Pol No</TableHeader>
                <TableHeader>Agent</TableHeader>
                <TableHeader>Buss Date</TableHeader>
                <TableHeader>Buss Type</TableHeader>
                <TableHeader>Premium</TableHeader>
                <TableHeader>Rate</TableHeader>
                <TableHeader>Gross</TableHeader>
                <TableHeader>W-Tax</TableHeader>
                <TableHeader>CBR</TableHeader>
                <TableHeader>NET</TableHeader>
              </TableHeaders>
              <TableBody>
                {
                  filteredCommissionList.map(e => (
                      <TableRow>
                        <TableCell>{moment(e.reporting_date,'YYYY-MM-DD').format('MMMM D, YYYY')}</TableCell>  
                        <TableCell>{e['Name of Insure']}</TableCell>
                        <TableCell>{e['Pol No']}</TableCell>
                        <TableCell>{e['Agent Name']}</TableCell>
                        <TableCell>{e['Buss Date']}</TableCell>
                        <TableCell>{e['Buss Type']}</TableCell>
                        <TableCell>{Round(e['Premium'], 2)}</TableCell> 
                        <TableCell>{Round(e['Rate']*100, 2)}%</TableCell> 
                        <TableCell>{Round(e['Gross'], 2)}</TableCell> 
                        <TableCell>{Round(e['WTax'], 2)}</TableCell> 
                        <TableCell>{Round(e['CBR'], 2)}</TableCell> 
                        <TableCell>{Round(e['NET'], 2)}</TableCell> 
                      </TableRow>
                    ))
                  }
              </TableBody>
            </DataTable>
          </TableContainer>
        </CommissionListContainer>
        :''
      }
    </CommissionContainer>
  )
}
