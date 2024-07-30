import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import useAxiosPrivate from '../../api/useAxiosPrivate'
import _ from 'lodash'
import moment from 'moment-timezone'

import {
  TeamContainer,
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
} from './team.style'

const {
  REACT_APP_SERVER
} = process.env;

const types = [
  'PERSONAL',
  'BASESHOP',
  'MD1',
  'MD2',
  'MD3',
  'MD4',
  'MD5',
  'MD6',
]

export default function Team() {
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [allTeam, SetAllTeam] = useState([])
  const [yearlySummary, SetYearlySummary] = useState([])
  const [montlySummary, SetMonthlySummary] = useState([])
  const [reportingDatesSummary, SetReportingDatesSummary] = useState([])
  const [type, SetType] = useState('yearly')
  const [activeDateFilter, SetActiveDateFilter] = useState('30D')

  const [listFilters, SetListFilters] = useState({
    dateFrom: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    dateTo: moment().format('YYYY-MM-DD'),
    date: 'all',
    sponsor: 'all',
    type: 'all',
    smd: 'all',
    keyword: ''
  })

  const getTeam = (agentCode) => {
    axiosPrivate.get(`${REACT_APP_SERVER}/team/get_team\?agentCode\=${agentCode}`)
    .then(res => {
      let overall = {}
      let yearly = {}
      let montly = {}
      let dates = {}
      let all_data = []
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        console.log(type)
        let type_data = res.data[type] || []
        console.log(type_data)
        type_data = _.uniqBy(type_data, 'agent_code')
        console.log(type,type_data)
        if (type_data.length > 0) all_data = all_data.concat(type_data.map(e => {
          e.type = type
          e.date = moment(e.date_started,'MM/DD/YYYY').format('YYYY-MM-DD')
          return e
        }));
        console.log(all_data)
        for (let ii = 0; ii < type_data.length; ii++) {
          const d = type_data[ii];
          let date = moment(d.date_started, 'MM/DD/YYYY')
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
      SetAllTeam(all_data)
    })
    .catch(err => {

    })
  }

  useEffect(() => {
    getTeam(auth.username)
  }, [])

  const dateFrom = moment(  listFilters.dateFrom, 'YYYY-MM-DD')
  const dateTo = moment(  listFilters.dateTo, 'YYYY-MM-DD')
  let all_team = allTeam.filter(e => {
    let d = moment(e.date_started, 'MM/DD/YYYY')
    return d >= dateFrom && d <= dateTo
  })

  let filterOptions = {
    dates: _.orderBy(_.uniq(_.map(all_team, 'date')),e => e, 'desc'),
    types: _.uniq(_.map(all_team, 'type')),
    sponsors: _.uniq(_.map(all_team, e => `${e.sponsor_code} - ${e.sponsor_name}`)),
    smd: _.uniq(_.map(all_team, e => `${e.smd_code} - ${e.smd_name}`)),
  }

  all_team = _.orderBy(all_team.filter(e => {

    if (listFilters.date != 'all' && listFilters.date !== e.date) return false 
    if (listFilters.type != 'all' && listFilters.type !== e.type) return false 
    if (listFilters.sponsor != 'all' && listFilters.sponsor !== `${e.sponsor_code} - ${e.sponsor_name}`) return false 
    if (listFilters.smd != 'all' && listFilters.smd !== `${e.smd_code} - ${e.smd_name}`) return false 
    if (listFilters.keyword.trim() !== '' && e.name.toLowerCase().indexOf(listFilters.keyword.toLowerCase().trim()) === -1) return false

    return true
  }), 'date', 'desc')

  console.log(all_team)

  return (
    <TeamContainer>
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
                  _.orderBy(_.toArray(montlySummary), e => parseInt(moment(e,'MMMM YYY').format('YYYYMMDD')), 'desc').map(e => (
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
                  _.orderBy(_.toArray(reportingDatesSummary), e => parseInt(moment(e,'YYYY-MM-DD').format('YYYYMMDD')), 'desc').map(e => (
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
              Sponsor
              <select onChange={el => SetListFilters({ ...listFilters, sponsor:  el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.sponsors.map(d => <option value={d}>{d}</option>)
                }
              </select>
            </div>
            <div>
              SMD
              <select onChange={el => SetListFilters({ ...listFilters, smd:  el.target.value})}>
                <option value={'all'}>All</option>
                {
                  filterOptions.smd.map(d => <option value={d}>{d}</option>)
                }
              </select>
            </div>
          </CommissionListFilters>

          <TableContainer>
            <DataTable>
              <TableHeaders>
                <TableHeader>Date</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Agent Code</TableHeader>
                <TableHeader>Rank</TableHeader>
                <TableHeader>Sponsor</TableHeader>
                <TableHeader>SMD</TableHeader>
                <TableHeader>Tyoe</TableHeader>
              </TableHeaders>
              <TableBody>
                {
                  all_team.map(e => (
                      <TableRow>
                        <TableCell>{moment(e.date,'YYYY-MM-DD').format('MMMM D, YYYY')}</TableCell>  
                        <TableCell>{e.name}</TableCell>
                        <TableCell>{e.agent_code}</TableCell>
                        <TableCell>{e.rank}</TableCell>
                        <TableCell>{`${e.sponsor_name} (${e.sponsor_code})`}</TableCell>
                        <TableCell>{`${e.smd_name} (${e.smd_code})`}</TableCell>
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
    </TeamContainer>
  )
}
