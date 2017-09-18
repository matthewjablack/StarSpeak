import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Collapsible, CollapsibleItem, Row, Card, Button, Icon} from '@mblackmblack/react-materialize'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default class SpeechDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paces: props.paces
    };
  }

  componentDidMount() {
    this.setState({
      containerWidth: this.refs.container.offsetWidth
    })
  }


  render() {
    return (
      <div className="bgWhite">
        <div className="container" ref="container">
          <Card textClassName='white-text' title='Pace (Words per minute)'>
            <AreaChart width={this.state.containerWidth} height={250} data={this.state.paces}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="joyColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="pace" stroke="#2ecc71" fillOpacity={1} fill="url(#joyColor)" />
            </AreaChart>
          </Card>

          <br/>
          {this.props.children}
          <br/><br/>
        </div>
      </div>
    )
  }
}
