import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import FontAwesome from 'react-fontawesome';
import {formatSeconds} from './format-time';
import { Button } from '@mblackmblack/react-materialize';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default class RenderRecord extends Component {
  render() {

    if (this.props.affectiva != null &&
      this.props.affectiva.emojis != null &&
      this.props.affectiva.emojis.dominantEmoji != null) {
      this.currentEmoji = this.props.affectiva.emojis.dominantEmoji;
      this.currentEmotion = this.props.affectiva.emojis;
    } else {
      this.currentEmoji = '--';
    }

    this.justArr = [{name: 'a', amt: 1, uv: 5},
                    {name: 'a', amt: 2, uv: 2},
                    {name: 'a', amt: 3, uv: 3},
                    {name: 'a', amt: 4, uv: 1},
                    {name: 'a', amt: 2, uv: 4},
                    {name: 'a', amt: 3, uv: 2}];

    this.zero = '0 0 40px #69F0AE' // , 0 0 20px #69F0AE, 0 0 20px #69F0AE, 0 0 20px #69F0AE, 0 0 20px #69F0AE';
    this.liveEmojiStyle = {
      fontSize: 40,
      textShadow: this.zero
    }

    return (
      <div>
        <div className="centerFixed">
          <span> 😐</span>
          <br/>
          <div style={this.liveEmojiStyle} >{this.currentEmoji}</div>
          <br/>
          <h2>
            {(this.props.presentCount % 2) == 0 ?
            <FontAwesome
              className='super-crazy-colors'
              name='circle'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',   display: 'none', position: 'fixed', top: '78px', marginLeft: '-25px' }}
            /> :
            <FontAwesome
              className='super-crazy-colors'
              name='circle'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#e74c3c', fontSize: '20px', position: 'fixed', top: '78px', marginLeft: '-25px' }}
            /> }
            {formatSeconds(this.props.presentCount)}
          </h2>

          <Button className="red lighten-2" waves="light" onClick={this.props.startStageAnalyze}>Stop</Button>

        </div>
        {this.props.children}
        <div className="centerFixed">
          <div className="alignBottom">
            <h3>{this.props.stt}</h3>
          </div>
        </div>
      </div>
    )
  }
}
