import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from 'react-materialize';

export default class RenderDevelop extends Component {
  render() {
    let continueButton;
    if (this.props.affectivaLoaded) {
      continueButton = (
        <Button className="red lighten-2" waves="light" onClick={this.props.startStageRecord}>
          Continue
        </Button>
      )
    } else {
      continueButton = (
        <p></p>
      )
    }
    return (
      <div>
        <div className="centerFixed">
          <h2>Loading Speech Analytics</h2>
          {continueButton}

        </div>
        {this.props.children}
      </div>
    )
  }
}
