import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button, Dropdown, NavItem } from '@mblackmblack/react-materialize';
import FontAwesome from 'react-fontawesome'

export default class RenderDevelop extends Component {
  render() {
    let presentCountDropdown
    if (this.props.mode === "StarLight") {
      presentCountDropdown = (
        <div className="time-limit">
          <h4>Choose the time limit for your presentation</h4>
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

    let continueButton = (
      <Button className="red lighten-2" waves="light" onClick={this.props.startStageConfidence}>
        Next
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
            <h4>Your time starts once you see the red recording button.</h4>
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
            <div>
              {presentCountDropdown}
            </div>
            <br/>
            {continueButton}

          </div>
          {this.props.children}
        </div>
      )
    }
  }
}
