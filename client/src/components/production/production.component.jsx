import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import useAxiosPrivate from '../../api/useAxiosPrivate'
import _ from 'lodash'
import moment from 'moment-timezone'

import {
  ProductionContainer,
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
  CommissionListFilters,
  LastScanTS
} from './production.style'

const {
  REACT_APP_SERVER
} = process.env;

const types = [
  'PERSONAL',
  'PERSONAL M',
  'BASESHOP',
  'MD1',
  'MD2',
  'MD3',
  'MD4',
  'MD5',
  'MD6',
]

export default function Production() {
  const { auth, activeAgent } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [allProduction, SetAllProduction] = useState([])
  const [yearlySummary, SetYearlySummary] = useState([])
  const [montlySummary, SetMonthlySummary] = useState([])
  const [reportingDatesSummary, SetReportingDatesSummary] = useState([])
  const [type, SetType] = useState('yearly')
  const [activeDateFilter, SetActiveDateFilter] = useState('30D')
  const [lastScan, SetLastScan] = useState(null)

  const [listFilters, SetListFilters] = useState({
    dateFrom: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    dateTo: moment().format('YYYY-MM-DD'),
    date: 'all',
    agent: 'all',
    type: 'all',
    plan_name: 'all',
    keyword: ''
  })

  const getLastScanned = (agentCode) => {
    axiosPrivate.get(`${REACT_APP_SERVER}/production/last_scan\?agentCode\=${agentCode}`)
    .then(res => {
      if (res.data.d) {
        SetLastScan(res.data.d)
      }
    }).catch(err => {

    })
  }

  const getProduction = (agentCode) => {
    axiosPrivate.get(`${REACT_APP_SERVER}/production/get_productions\?agentCode\=${agentCode}`)
    .then(res => {
      let overall = {}
      let yearly = {}
      let montly = {}
      let dates = {}
      let all_data = []

      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        let type_data = []

        switch(type) {
          case 'PERSONAL':
            type_data = res.data['PERSONAL'] || []
            type_data = type_data.filter(e => e.agent_code_2 === "")
            break
          case 'PERSONAL M':
            type_data = res.data['PERSONAL'] || []
            type_data = type_data.filter(e => e.agent_code_2 !== "")
            break
          default: 
            type_data = res.data[type] || []
        }

        type_data = _.uniqBy(type_data, 'application_number')
        if (type_data.length > 0) all_data = all_data.concat(type_data.map(e => {
          e.type = type
          e.date = moment(e.business_date,'MM/DD/YYYY').format('YYYY-MM-DD')
          return e
        }));
        
        for (let ii = 0; ii < type_data.length; ii++) {
          const d = type_data[ii];
          let date = moment(d.business_date, 'MM/DD/YYYY')
          const year_key = date.format('YYYY')
          const month_key = date.format('MMMM YYYY')
          const date_key = date.format('YYYY-MM-DD')
          
          if (!yearly[year_key]) yearly[year_key] = { year: year_key }
          if (!montly[month_key]) montly[month_key] = { month: month_key }
          if (!dates[date_key]) dates[date_key] = { date: date_key}

          if (!yearly[year_key][type] ) yearly[year_key][type] = 0
          if (!montly[month_key][type] ) montly[month_key][type] = 0
          if (!dates[date_key][type] ) dates[date_key][type] = 0
          if (!overall[type] ) overall[type] = 0

          yearly[year_key][type] += 1
          montly[month_key][type] += 1
          dates[date_key][type] += 1
          overall[type] += 1
        }
      }

      SetYearlySummary(yearly)
      SetMonthlySummary(montly)
      SetReportingDatesSummary(dates)
      SetAllProduction(all_data)
    })
    .catch(err => {

    })
  }

  useEffect(() => {
    getProduction(activeAgent.username)
    getLastScanned(activeAgent.username)
  }, [])

  const dateFrom = moment( listFilters.dateFrom, 'YYYY-MM-DD')
  const dateTo = moment( listFilters.dateTo, 'YYYY-MM-DD')
  let all_production = allProduction.filter(e => {
    let d = moment(e.business_date, 'MM/DD/YYYY')
    return d >= dateFrom && d <= dateTo
  })

  let agent1 = _.map(all_production, e => `${e.agent_code_1} - ${e.agent_name_1}`)
  let agent2 = _.map(all_production.filter(e => e.agent_code_2 !== ""), e => `${e.agent_code_2} - ${e.agent_name_2}`)
  let agents = _.uniq(_.concat(agent1, agent2))
  agents.sort()

  let filterOptions = {
    dates: _.orderBy(_.uniq(_.map(all_production, 'date')),e => e, 'desc'),
    types: _.uniq(_.map(all_production, 'type')),
    plan_names: _.uniq(_.map(all_production, 'plan_name')),
    agents
  }

  all_production = _.orderBy(all_production.filter(e => {

    if (listFilters.date != 'all' && listFilters.date !== e.date) return false 
    if (listFilters.type != 'all' && listFilters.type !== e.type) return false 
    if (listFilters.agent != 'all' 
        && listFilters.agent !== `${e.agent_code_1} - ${e.agent_name_1}` 
        && listFilters.agent !== `${e.agent_code_2} - ${e.agent_name_2}`) return false 
    if (listFilters.plan_name != 'all' && listFilters.plan_name !== e.plan_name) return false 
    if (listFilters.keyword.trim() !== '' && e.plan_holder.toLowerCase().indexOf(listFilters.keyword.toLowerCase().trim()) === -1) return false

    return true
  }), 'date', 'desc')

  return (
    <ProductionContainer>
      <LastScanTS>Last Scan Time: { lastScan ? moment(lastScan,'X').tz('Asia/Manila').format('DDDD MMM D, YYYY h:mm A') : '-' }</LastScanTS>

      <TypeContainer>
        <TypeBtn active={type === 'yearly'} onClick={() => SetType('yearly')}>Yearly</TypeBtn>
        <TypeBtn active={type === 'monthly'} onClick={() => SetType('monthly')}>Monthly</TypeBtn>
        <TypeBtn active={type === 'report_date'} onClick={() => SetType('report_date')}>Daily</TypeBtn>
        <TypeBtn active={type === 'list'} onClick={() => SetType('list')}>Team List</TypeBtn>
      </TypeContainer>

      {
        type === 'yearly' ?
        <TableContainer>
          <TableTitle>Yearly Reports</TableTitle>
          <DataTable>
            <TableHeaders>
              <TableHeader>Year</TableHeader>
              {
                types.map(t =>  <TableHeader>{t}</TableHeader>)
              }
            </TableHeaders>
            <TableBody>
                {
                  _.orderBy(_.toArray(yearlySummary), 'year', 'desc').map(e => (
                    <TableRow>
                      <TableCell>{e.year}</TableCell>  
                      {
                        types.map(t =>  <TableCell>{e[t] || 0}</TableCell>)
                      }
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
              {
                types.map(t =>  <TableHeader>{t}</TableHeader>)
              }
            </TableHeaders>
            <TableBody>
                {
                  _.orderBy(_.toArray(montlySummary), e => parseInt(moment(e.month,'MMMM YYYY').format('X')), 'desc').map(e => (
                    <TableRow>
                      <TableCell>{e.month}</TableCell>  
                      {
                        types.map(t =>  <TableCell>{e[t] || '-'}</TableCell>)
                      }
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
          <TableTitle>Daily</TableTitle>
          <DataTable>
            <TableHeaders>
              <TableHeader>Date</TableHeader>
              {
                types.map(t =>  <TableHeader>{t}</TableHeader>)
              }
            </TableHeaders>
            <TableBody>
                {
                  _.orderBy(_.toArray(reportingDatesSummary), e => parseInt(moment(e.date,'YYYY-MM-DD').format('YYYYMMDD')), 'desc').map(e => (
                    <TableRow>
                      <TableCell>{moment(e.date, 'YYYY-MM-DD').format('MMMM D, YYYY')}</TableCell>  
                      {
                        types.map(t =>  <TableCell>{e[t] || '-'}</TableCell>)
                      }
                    </TableRow>
                  ))
                }
            </TableBody>

          </DataTable>
        </TableContainer>
        :''
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
              Date 
              <select onChange={el => SetListFilters({ ...listFilters, date:  el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.dates.map(d => <option value={d}>{moment(d,'YYYY-MM-DD').format('MMMM D, YYYY')}</option>)
                }
              </select>
            </div>
            <div>
              Type 
              <select onChange={el => SetListFilters({ ...listFilters, type:  el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.types.map(d => <option value={d}>{d}</option>)
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
              Plan
              <select onChange={el => SetListFilters({ ...listFilters, plan_name:  el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.plan_names.map(d => <option value={d}>{d}</option>)
                }
              </select>
            </div>
          </CommissionListFilters>

          <TableContainer>
            <DataTable>
              <TableHeaders>
                <TableHeader>Date</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Application #</TableHeader>
                <TableHeader>Policy #</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Plan Name</TableHeader>
                <TableHeader>Provider</TableHeader>
                <TableHeader>Agent 1</TableHeader>
                <TableHeader>Agent 2</TableHeader>
                <TableHeader>Type</TableHeader>
              </TableHeaders>
              <TableBody>
                {
                  all_production.map(e => (
                      <TableRow>
                        <TableCell>{moment(e.date,'YYYY-MM-DD').format('MMMM D, YYYY')}</TableCell>  
                        <TableCell>{e.plan_holder}</TableCell>
                        <TableCell>{e.application_number}</TableCell>
                        <TableCell>{e.policy_number}</TableCell>
                        <TableCell>{e.policy_status}</TableCell>
                        <TableCell>{e.plan_name}</TableCell>
                        <TableCell>{e.provider}</TableCell>
                        <TableCell>{`${e.agent_name_1} (${e.agent_code_1})`}</TableCell>
                        <TableCell>{e.agent_code_2 !== "" ? `${e.agent_name_2} (${e.agent_code_2})` : '-'}</TableCell>
                        <TableCell>{`${e.type}`}</TableCell>
                      </TableRow>
                    ))
                  }
              </TableBody>
            </DataTable>
          </TableContainer>
        </CommissionListContainer>
        :''
      }
    </ProductionContainer>
  )
}
