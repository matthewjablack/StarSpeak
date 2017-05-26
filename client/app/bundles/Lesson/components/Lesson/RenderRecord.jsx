import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import FontAwesome from 'react-fontawesome';
import {formatSeconds} from './format-time';
import { Button } from 'react-materialize';

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
