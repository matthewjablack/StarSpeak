import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import FontAwesome from 'react-fontawesome';
import {formatSeconds} from './format-time';

export default class RenderRecord extends Component {
  render() {
    return (
      <div>
        <div className="centerFixed">
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
            <button className="whiteBtnSpace" onClick={this.props.startStageAnalyze}>Stop</button>
          </h2>
        </div>
        <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.props.width} height={this.props.width * 0.75} ref='webcam'/>
      </div>
    )
  }
}
