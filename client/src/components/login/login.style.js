import styled from "styled-components";


export const LoginMainContainer = styled.div` 
  position: relative;
  display: flex;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  background: #080E18;
  position: relative;
  font-family: 'Lato';

`


export const LoginFromContainer = styled.div` 

  position: relative;
  margin: auto;
  /* display: flex; */
  box-sizing: border-box;
  height: 300px;
  width: 300px;
  background: #292d33;
  position: relative;
  font-family: 'Lato';

  padding: 30px;

  color: #ffffff;

  >div:nth-child(1) {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 30px;
  }

  input {
    text-align: center;
    outline: none;
  }

  form {
    margin-top: 20px;
    
    >div {
      margin: auto;
      display: grid;
      font-size: 14px;
      grid-template-columns: 80px 120px;
      margin-bottom: 5px;
    }
  }

`

