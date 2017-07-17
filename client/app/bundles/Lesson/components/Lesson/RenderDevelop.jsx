import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';

export default class RenderDevelop extends Component {
  render() {
    let continueButton = (
      <Button className="red lighten-2" waves="light" onClick={this.props.startStagePreload}>
        Continue
      </Button>
    )
    if (this.props.mode == "StarView") {
      return (
        <div>
          <div className="centerFixed">
            <h1>{this.props.lesson.name}</h1>
            <h4>Read the situation below and present your solution to the best of your ability.</h4>
            <h2>{this.props.lesson.content}</h2>
            <h4>You have {this.props.presentCount} seconds to present.</h4>
            {continueButton}

          </div>
          {this.props.children}
        </div>
      )
    } else if (this.props.mode == "StarLight") {
      return (
        <div>
          <div className="centerFixed">
            <h1>StarLight</h1>
            <h4>You'll have {this.props.presentCount} seconds to present a quick speech.</h4>
            {continueButton}

          </div>
          {this.props.children}
        </div>
      )
    }
  }
}
