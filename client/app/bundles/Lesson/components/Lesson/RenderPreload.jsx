import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';

export default class RenderPreload extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    let preloadContent;
    if (this.props.affectivaLoaded) {
      preloadContent = (
        <div>
          <Button className="red lighten-2" waves="light" onClick={this.props.startStageRecord}>
            Next
          </Button>
        </div>
      );
    } else {
      preloadContent = (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div>
        <div className="centerFixed">
          {preloadContent}
        </div>
        {this.props.children}
      </div>
    )
  }
}
