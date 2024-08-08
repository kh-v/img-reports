import React, { Component } from 'react'
import moment from 'moment-timezone'

export default class Liveclock extends Component {
  constructor(props) {
    super(props);

    this.state = { date:  moment() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: moment()
    });
  }

  render() {
    return (
      <div style={{display:'inline-flex'}}><div  style={{width:'70px'}}>{this.state.date.tz('Asia/Manila').format('h:mm:ss A')}</div><div style={{width:'200px',paddingRight:'5px'}}>{this.state.date.tz('Asia/Manila').format('dddd, MMMM D, YYYY')}</div></div>
    );
  }
}
