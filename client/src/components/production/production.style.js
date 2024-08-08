import styled from "styled-components";

export const ProductionContainer = styled.div`
  background: #000000;
  box-sizing: border-box;
  position: relative;
  height: calc(100vh - 100px);
  width: calc(100% - 40px);
  overflow-y: auto;
  overflow-x: auto;
  margin: 20px;

  padding: 20px;

  min-width: 800px;
`

export const TableContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  background: #000000;
  /* height: calc(100% - 100px); */
  width: calc(100% - 40px);
  margin-bottom: 20px;

  min-width: 800px;
  
  >table {
    /* margin-top: 50px; */
  }
`

export const TableTitle = styled.div`
  box-sizing: border-box;
  color: #ffffff;
  line-height: 25px;
  top: 20px;
`

export const DataTable = styled.table`
  /* margin-top: 20px; */
  /* margin-bottom: 10px; */
  color: #FFFFFF;
  /* width: 100%; */
  min-width: 800px;
  text-align: center;
  font-size: 13px;
  margin: auto;

  border-spacing: 0 1px;
`

export const TableHeaders = styled.thead`
  background: #0C129E;
  height: 30px;
  line-height: 30px;
  font-weight: 600;

`
export const TableHeader = styled.th`

`
export const TableBody = styled.tbody`
  >tr:nth-child(odd) {
    background: #424040;
  }
  >tr:nth-child(even) {
    background: #3B3939;
  }

`
export const TableRow = styled.tr`
  line-height: 30px;
`
export const TableCell = styled.td`
  font-weight: 500;
  min-width: 100px;
  padding-left: 5px;
  padding-right: 5px;
`


export const TypeContainer = styled.div`
  padding: 20px;
`

export const TypeBtn = styled.button`
  height: 30px;
  padding: 5px 10px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  margin-left: 2px;

  ${({active}) => active ? 
    `
      background: #1c24e6;
      color: #ffffff;
    `:`
      background: #0C129E;
      color: #ffffff;
    `}
`




export const CommissionListContainer = styled.div`
  
`

export const CommissionListDateFilters = styled.div`
  padding: 20px;
  padding-bottom: 10px;
`

export const CommissionListDateBtn = styled.button`
  height: 20px;
  padding: 2px 10px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  margin-left: 2px;

  ${({active}) => active ? 
    `
      background: #1c24e6;
      color: #ffffff;
    `:`
      background: #0C129E;
      color: #ffffff;
    `}
`

export const CommissionListFilters = styled.div`
  padding: 20px;
  padding-bottom: 10px;
  color: #ffffff;
  text-align: center;
  display: inline-flex;

  >div {
    margin-left: 10px;
    font-size:  14px;
    >input {
      margin-left: 5px;
      outline: none;
      line-height: 20px;
      height: 20px;
      text-align: center;
      background: none;
      color: #ffffff;
      border: none;
      border-bottom: 1px solid #ffffff;
    }

    >select {
      margin-left: 5px;
      outline: none;
      line-height: 20px;
      height: 20px;
      text-align: center;
      background: none;
      color: #ffffff;
      border: none;
      border-bottom: 1px solid #ffffff;


    }
  }
`

export const LastScanTS = styled.div`
  position: absolute;
  top: 5px;
  right: 10px;
  color: #ffffff;
  font-style: italic;
  font-size: 12px;
`