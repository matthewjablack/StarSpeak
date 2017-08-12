import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';

export default class RenderPreload extends Component {

  setElements() {
    if (this.props.affectivaLoaded) {
      this.speechAnalyticsSection = (
        <div>
          <p>loaded!</p>
          <Button className="red lighten-2" waves="light" onClick={this.props.startStageRecord}>
            Continue FROM PRELOAD
          </Button>
        </div>
      )
    } else {
      this.speechAnalyticsSection = (
        <p>Loading...</p>
      )
    }
  }

  render() {
    this.setElements();


    /* TODO: 'children' removable? */
    return (
      <div>
        <div className="centerFixed">
          {this.speechAnalyticsSection}

        </div>
        {this.props.children}
      </div>
    )
  }
}
