import styled from "styled-components";

import { ReactComponent as statusDotSVG } from '../../assets/status_dot.svg'
import { ReactComponent as sprxProsSVG } from '../../assets/spxpros_header.svg'
import { ReactComponent as prosSVG } from '../../assets/pros_header.svg'
import { ReactComponent as menuSVG } from '../../assets/menu.svg'

export const StatusDotIcon = styled(statusDotSVG)`
  fill: ${({fill}) => fill ? fill : '#dddddd'};
  height: ${({height}) => height ? height : '10px'};
  width:  ${({width}) => width ? width : '10px'};
`


export const SpxProsIcon = styled(sprxProsSVG)`
  fill: ${({fill}) => fill ? fill : '#dddddd'};
  // height: ${({height}) => height ? height : '10px'};
  // width:  ${({width}) => width ? width : '10px'};
`

export const ProsIcon = styled(prosSVG)`
  fill: ${({fill}) => fill ? fill : '#dddddd'};
  // height: ${({height}) => height ? height : '10px'};
  // width:  ${({width}) => width ? width : '10px'};
`
export const MenuIcon = styled(menuSVG)`
  fill: ${({fill}) => fill ? fill : '#dddddd'};
  height: ${({height}) => height ? height : '25px'};
  width:  ${({width}) => width ? width : '25px'};
  position: absolute;
  top: 15px;
  right: 15px;
`

export const HeaderContainer = styled.div` 
  position: relative;
  display: flex;
  box-sizing: border-box;
  height: 60px;
  background: #080E18;
  position: relative;
  font-family: 'Lato';
  color: #ffffff;
  line-height: 60px;

  >div:nth-child(1) {
    position: absolute;
    /* padding-left: ${({name}) => name === 'PROS' ? '210':'240'}px; */
    padding-left: 20px;
    text-align: left;
    font-size: 14px;
    line-height: 62px;
  }

  ${SpxProsIcon} {
    position: absolute;
    top: 5px;
    left: 50px;
  }
  ${ProsIcon} {
    position: absolute;
    top: 7px;
    left: 50px;
  }
`

export const Title = styled.div` 
  position: absolute;
  box-sizing: border-box;
  font-family: 'Arial';
  font-style: normal;
  // font-weight: 700;
  font-size: 30px;
  line-height: 40px;
  top: 10px;
  left: 25px;
  
  >span:nth-child(1) {
    color: #489F5E;
    font-family: 'Playfair Display';
    font-style: normal;
    font-weight: 400;
    text-transform: capitalize;
  }
  
  >span:nth-child(2) {
    color: #C42D22;
    font-family: 'Lato';
    font-style: italic;
    text-transform: capitalize;
  }
`

export const NewsBanner = styled.div`
  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  width: 60vw;
  height: 60px;
  line-height: 60px;
  text-align: center;
  align-items: center;
  justify-content: center;

  color: #00C2FF;
  margin: auto;

  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 23px;

  text-align: center;
  text-transform: capitalize;
`

export const NewsEntry = styled.div` 

  
`

export const NewsTime = styled.span` 
  color: #FFFFFF;
  font-weight: 400;
  padding-left: 10px;
  padding-right: 10px;
`

export const NewsImportance = styled.span` 
  color: #938F8F;
  font-weight: 400;
  /* padding-left: 10px; */
  padding-right: 10px;
`

export const StatusContainer = styled.div` 
  position: absolute;
  box-sizing: border-box;
  /* border: 1px solid red; */
  min-width: 100px;
  display: grid;
  grid-template-rows: auto;
  line-height: 60px;
  right: 0;
`

export const StatusItems = styled.div` 
  display: inline-flex;
  box-sizing: border-box;
  height: 30px;
  align-items: right;
  text-align: right;
  justify-content: right;
  padding-right: 40px;
`
export const StatusItem = styled.div` 
  position: relative;
  display: inline-flex;
  box-sizing: border-box;
  color: #FFFFFF;
  height: 30px;

  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 35px;
  /* identical to box height */

  text-align: right;
  padding-left: 20px;

  ${StatusDotIcon} {
    position: absolute;
    height: 7px;

    left: 5px;
    top: 14px
  }

`

export const StatusDateTime = styled.div` 
  box-sizing: border-box;
  /* display: inline-flex; */
  /* border: 1px solid red; */
  color: #FFFFFF;
  line-height: 60px;
  text-align: right;
  padding-right: 20px;
  font-size: 12px;
  font-weight: 700;
  padding-right: 40px;
`

export const Menu = styled.div`
  z-index: 1;
  box-sizing: border-box;
  position: absolute;
  top: 30px;
  right: 20px;
  /* height: 100px; */
  width: 280px;
  background: #09202a;
  color: #ffffff;

`

export const MenuItem = styled.div` 
  cursor: pointer;
  box-sizing: border-box;
  /* border: 1px solid #ffffff; */
  height: 25px;

  text-align: left;
  padding-left: 15px;
  font-size: 12px;
  line-height: 25px;

  ${({active}) => active ? 'background: grey;':''}
`