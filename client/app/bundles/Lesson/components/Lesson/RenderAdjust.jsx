import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button, Dropdown, NavItem } from '@mblackmblack/react-materialize';
import FontAwesome from 'react-fontawesome'

export default class RenderAdjust extends Component {

  render() {
    return (
      <div>
        <div className="centerFixed">
          <h2>Adjust your camera</h2>
          <div className="row center">
            <Button className="red lighten-2" waves="light" onClick={this.props.startStagePreload}>Next</Button>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}
