import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';

export default class RenderDevelop extends Component {
  render() {
    return (
      <div>
        <div className="centerFixed">
          <h1 >{this.props.lesson.name}</h1>

          <br/><br/><br/><br/><br/><br/>

          <h3 >Read the situation below and present your solution to the best of your ability.</h3>
          <br/>
          <h2 >{this.props.lesson.content}</h2>
          <h2 >You have {this.props.lesson.length} seconds to present.</h2>
          <button className="whiteBtn" onClick={this.props.startStageRecord}>Continue</button>
        </div>
        {this.props.children}
      </div>
    )
  }
}
