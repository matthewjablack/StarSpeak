import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';

export default class RenderIntro extends Component {
  render() {
    return (
      <div className="frontPg">
        <h1 className="white">Welcome to StarSpeak</h1>
        <h2 className="white">Helping students to embrace their presentation.</h2>
        <br/>
        <p>&nbsp;</p>
        <button className="whiteBtn" onClick={this.props.startStageAdjust}>Start</button>
      </div>
    )
  }
}
