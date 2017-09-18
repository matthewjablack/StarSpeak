import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Collapsible, CollapsibleItem, Collection, CollectionItem, Row, Col, Card, Button, Icon} from '@mblackmblack/react-materialize'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default class SpeechDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paces: props.paces,
      presentation_count: props.presentation_count,
      presentation_hours: props.presentation_hours,
      speech_stats: props.speech_stats,
      emotions: props.emotions
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
          <Card title={'Speech Results'}>
            <Row>
              <Col m={3}>
                <h2>{this.state.presentation_count}</h2>
                <p>Presentations</p>
              </Col>
              <Col m={3}>
                <h2>{this.state.presentation_hours}</h2>
                <p>Hours spent presenting</p>
              </Col>
            </Row>
          </Card>

          <Card  title='Pace (Words per minute)'>
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

            <p>The optimal pace is between 120-150 words per minute.</p>
          </Card>

          <Card textClassName='white-text' title='Average Facial Emotions Per Presentation (%)'>
            <AreaChart width={this.state.containerWidth} height={250} data={this.state.emotions}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="joyColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="sadnessColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2980b9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2980b9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="excitementColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f1c40f" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f1c40f" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="angerColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#e74c3c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="joy" stroke="#2ecc71" fillOpacity={1} fill="url(#joyColor)" />
              <Area type="monotone" dataKey="sadness" stroke="#2980b9" fillOpacity={1} fill="url(#sadnessColor)" />
              <Area type="monotone" dataKey="excitement" stroke="#f1c40f" fillOpacity={1} fill="url(#excitementColor)" />
              <Area type="monotone" dataKey="anger" stroke="#e74c3c" fillOpacity={1} fill="url(#angerColor)" />
            </AreaChart>
          </Card>

          <Collection>
          {this.state.speech_stats.map((speechStat) => 
            <CollectionItem href={'/speech_stats/' + speechStat.id}>Presentation #{speechStat.id}</CollectionItem>
          )}
          </Collection>

          <br/>
          {this.props.children}
          <br/><br/>
        </div>
      </div>
    )
  }
}
