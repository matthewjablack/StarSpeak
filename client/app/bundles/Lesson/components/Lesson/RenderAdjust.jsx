import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';

export default class RenderAdjust extends Component {
  render() {
    return (
      <div>
        <div className="centerFixed">
          <h2 className="white">Adjust your camera</h2>
          <button className="whiteBtn" onClick={this.props.startStageDevelop}>Ready</button>
        </div>
        <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.props.width} height={this.props.width * 0.75}/>
      </div>
    )
  }
}
