import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';

export default class RenderPreload extends Component {
  render() {
    let continueButton;
    console.log("VINIT VINIT VINIT"+this.props.affectivaLoaded);
    if (this.props.affectivaLoaded) {
      continueButton = (
        <Button className="red lighten-2" waves="light" onClick={this.props.startStageRecord}>
          Continue FROM PRELOAD
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
