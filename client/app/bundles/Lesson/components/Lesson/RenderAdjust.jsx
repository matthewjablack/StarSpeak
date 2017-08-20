import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button, Dropdown, NavItem } from '@mblackmblack/react-materialize';
import FontAwesome from 'react-fontawesome'

export default class RenderAdjust extends Component {

  render() {
    let presentCountDropdown
    if (this.props.mode === "StarLight") {
      presentCountDropdown = (
        <div className="time-limit">
          <p>Choose the time limit for your presentation</p>
          <Dropdown trigger={
              <Button waves="light">
                {this.props.presentCount} Seconds &nbsp;
                <FontAwesome
                  name='caret-down'
                />
              </Button>
            }>
            {[10,20,30,40,50,60].map((x,index) => <NavItem key={x} onClick={() => this.props.updatePresentCount(x)}>{x} Seconds</NavItem>)}
          </Dropdown>
        </div>
      )
    }
    
    return (
      <div>
        <div className="centerFixed">
          <h2>Adjust your camera</h2>
          <div className="row center">
            <Button className="red lighten-2" waves="light" onClick={this.props.startStageDevelop}>Ready</Button>
          </div>
          <div>
            {presentCountDropdown}
          </div>
        </div>
        <canvas className="visualizer" width="320" height="50"></canvas> 
        {this.props.children}
      </div>
    )
  }
}
