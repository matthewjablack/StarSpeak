require('wavesurfer.js');

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Stats} from './stats';
import Pace from './Pace';
import UmCount from './UmCount';
import GradeLevel from './GradeLevel';
import {Collapsible, CollapsibleItem, Row, Card, Button, Icon} from '@mblackmblack/react-materialize'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import sizeMe from 'react-sizeme';
import Wavesurfer from 'react-wavesurfer';
import WordImpactBoxContainer from './WordImpactBoxContainer';

class RenderResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      playing: false, 
      pos: 0
    };
    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
  }

  componentDidMount() {
    this.setState({containerWidth: this.refs.container.offsetWidth});
  }

  handleTogglePlay() {
    this.setState({
      playing: !this.state.playing
    });
  }
  handlePosChange(e) {
    this.setState({
      pos: e.originalArgs[0]
    });
  }

  render() {
    return (
      <div className="bgWhite">
        <div className="container" ref="container">
          <a className='btn red lighten-2' href={this.props.linkback}>Click here when finished<Icon left>reply</Icon></a><br/>

          <Row>
            <Card className="hoverable center">
              <h4>Hey {this.props.user.first_name}, here's your presentation results</h4>
              <p>{this.props.local.stt}</p><br/>
              <img src={this.props.screenshot} style={{objectFit: 'cover', borderRadius:100, width: 150, height: 150}}/>
            </Card>
          </Row>

          <Collapsible accordion popout defaultActiveKey={0}>
            <Pace pace={this.props.local.pace} />
            <UmCount umCount={this.props.umCount} />
            <GradeLevel gradeScore={this.props.gradeScore} />
          </Collapsible>

          <Card textClassName='white-text' title='Facial Emotions'>
            <AreaChart width={this.state.containerWidth} height={250} data={this.props.facialStatsContainer.emotionsData()}
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

          <Card>
            <Wavesurfer
              audioFile={this.props.video.direct_upload_url}
              pos={this.state.pos}
              onPosChange={this.handlePosChange}
              playing={this.state.playing}
            />
            <div style={{textAlign: 'center'}}>
              <Button className="red lighten-2" waves="light" onClick={this.handleTogglePlay}>
                <i className="glyphicon glyphicon-play"></i>
                Play
              </Button>

              <div className="row">
                <div className="col-xs-1">
                  <i className="glyphicon glyphicon-zoom-in"></i>
                </div>

                <div className="col-xs-10">
                  <input id="slider" type="range" min="1" max="200" defaultValue="1" style={{width: '100%'}} />
                </div>

                <div className="col-xs-1">
                  <i className="glyphicon glyphicon-zoom-out"></i>
                </div>
              </div>
            </div>

            <WordImpactBoxContainer
              speechFrameContainer={this.props.speechFrameContainer}
              facialStatsContainer={this.props.facialStatsContainer}
            />
          </Card>

          <br/>
          <Stats stage={this.props.stage} indico={this.props.indico} watson={this.props.watson} user={this.props.user} screenshot={this.props.screenshot} local={this.props.local} />
          {this.props.children}
          <br/><br/>
          <p></p>
        </div>
      </div>
    )
  }
}
export default sizeMe({ monitorWidth: true })(RenderResults);
