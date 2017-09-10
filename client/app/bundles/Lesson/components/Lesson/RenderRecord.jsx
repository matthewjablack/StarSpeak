import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import FontAwesome from 'react-fontawesome';
import {formatSeconds} from './format-time';
import { Button } from '@mblackmblack/react-materialize';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default class RenderRecord extends Component {
  render() {

    let joy = -1;
    let sadness = -1; 
    let anger = -1;
    let surprise = -1;

    if (this.props.emotions != null) {
      joy = Math.floor(this.props.emotions.joy);
      sadness = Math.floor(this.props.emotions.sadness);
      anger = Math.floor(this.props.emotions.anger);
      surprise = Math.floor(this.props.emotions.surprise);
    };

    this.joyGlow = '0 0 40px #69F0AE';
    this.sadnessGlow = '0 0 40px #69F0AE'
    this.angerGlow = '0 0 40px #69F0AE';
    this.surpriseGlow = '0 0 40px #69F0AE'

    for (var i = 0; i < (joy/8); i++) {
      this.joyGlow += ' , 0 0 20px #69F0AE';
    }
    for (var i = 0; i < (sadness/8); i++) {
      this.sadnessGlow += ' , 0 0 20px #69F0AE';
    }
    for (var i = 0; i < (anger/8); i++) {
      this.angerGlow += ' , 0 0 20px #69F0AE';
    }
    for (var i = 0; i < (surprise/8); i++) {
      this.surpriseGlow += ' , 0 0 20px #69F0AE';
    }

    this.joyEmojiStyle = {
      fontSize: 50,
      textShadow: this.joyGlow,
      marginRight: 15
    };
    this.sadnessEmojiStyle = {
      fontSize: 50,
      textShadow: this.sadnessGlow,
      marginRight: 15
    };
    this.angerEmojiStyle ={
      fontSize: 50,
      textShadow: this.angerGlow,
      marginRight: 15
    };
    this.surpriseEmojiStyle = {
      fontSize: 50,
      textShadow: this.surpriseGlow,
      marginRight: 15
    };

    return (
      <div>
        <div style={{position: 'absolute', right: 30, top: 80, zIndex: 11}}>
          <div style={this.joyEmojiStyle} className="inline-block">😃</div>
          <div style={this.sadnessEmojiStyle} className="inline-block">🙁</div>
          <div style={this.angerEmojiStyle} className="inline-block">😠</div>
          <div style={this.surpriseEmojiStyle} className="inline-block">😮</div>
        </div>
        <div className="centerFixed">
          <h2>
            {(this.props.presentCount % 2) == 0 ?
            <FontAwesome
              className='super-crazy-colors'
              name='circle'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',   display: 'none', position: 'fixed', top: '78px', marginLeft: '-25px' }}/>
               :
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
