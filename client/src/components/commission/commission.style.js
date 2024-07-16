import styled from "styled-components";

export const CommissionContainer = styled.div`
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
`