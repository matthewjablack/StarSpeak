import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button, Dropdown, NavItem } from 'react-materialize';
import FontAwesome from 'react-fontawesome'

export default class RenderAdjust extends Component {

  constructor(props) {
    super(props);
    this.state = {
      presentCount: this.props.presentCount
    };

    this.updatePresentCount = this.updatePresentCount.bind(this);
  }

  updatePresentCount(x) {
    console.log('testing info');
    console.log(x);
    this.props.updatePresentCount(x);
    this.setState({presentCount: x})
  }

  render() {
    return (
      <div>
        <div className="centerFixed">
          <h2>Adjust your camera</h2>
          <div className="row center">
            <Button className="red lighten-2" waves="light" onClick={this.props.startStageDevelop}>Ready</Button>
          </div>
          <div>
            <Dropdown trigger={
                <Button>
                  {this.state.presentCount} Seconds &nbsp;
                  <FontAwesome
                    name='caret-down'
                  />
                </Button>
              }>
              {[10,20,30,40,50,60].map((x,index) => <NavItem key={x} onClick={() => this.props.updatePresentCount(x)}>{x} Seconds</NavItem>)}
            </Dropdown>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}
