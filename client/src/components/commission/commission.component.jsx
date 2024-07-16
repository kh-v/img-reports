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
  TableCell
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
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [yearlySummary, SetYearlySummary] = useState([])
  const [montlySummary, SetMonthlySummary] = useState([])
  const [rateSummary, SetRateSummary] = useState([])

  const getCommissionSummary = (agentCode) => {
    axiosPrivate.get(`${REACT_APP_SERVER}/commission/get_summary\?agentCode\=${agentCode}`)
    .then(res => {
      let { yearly, monthly } =  res.data

      yearly = _.toArray(yearly)
      SetYearlySummary(yearly)
      monthly = _.toArray(monthly)
      SetMonthlySummary(monthly)
    })
    .catch(err => {

    })
  }

  const getRateCommissionSummary = (agentCode) => {
    axiosPrivate.get(`${REACT_APP_SERVER}/commission/get_rate_summary\?agentCode\=${agentCode}`)
    .then(res => {
      let rates = _.mapValues(res.data, (d,r) => {
        let { yearly, monthly } =  d
        yearly = _.toArray(yearly)
        monthly = _.toArray(monthly)
        
        return {
          rate: parseFloat(r),
          yearly,
          monthly
        }
      })

      rates = _.toArray(rates)
      rates = _.orderBy(rates, 'rate', 'desc')
      SetRateSummary(rates)
      
    })
    .catch(err => {

    })
  }



  useEffect(() => {
    getCommissionSummary('450723PH')
    getRateCommissionSummary('450723PH')
  }, [])

  return (
    <CommissionContainer>
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
      {
        rateSummary.map(r => (
          <div>
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
          </div>
        ))
      }
    </CommissionContainer>
  )
}
