import styled from "styled-components";


export const MainContainer = styled.div` 
  position: relative;
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  background: #080E18;
  position: relative;
  font-family: 'Lato';

`


export const ReportsContainer = styled.div` 

  position: relative;
  margin: auto;
  /* display: flex; */
  box-sizing: border-box;
  height: 300px;
  width: 300px;
  /* background: #292d33; */
  position: relative;
  font-family: 'Lato';

  padding: 30px;

  color: #ffffff;

  >div {
    box-sizing: border-box;
    background: #292d33;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 30px;
    line-height: 50px;
  }

  >div:nth-child(1) {
    box-sizing: border-box;
    background: none;
    
    font-weight: 600;
    /* margin-bottom: 30px;
    line-height: 50px; */
   
    >div:nth-child(1) {
      font-size: 20px;
      line-height: 30px;
    }
    >div:nth-child(2) {
      font-size: 12px;
      line-height: 20px;
    }
    >div:nth-child(3) {
      font-size: 12px;
      line-height: 20px;
    }
  }
`

