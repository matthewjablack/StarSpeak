import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Pace extends Component {
  render() {
  	let paceInfo;
    if ((this.props.pace > 5) && (this.props.pace < 50)) {
  		paceInfo = (<p className="red-txt">Your talking pace was very slow. Try working on reducing your pauses. </p>);
  	} else if ((this.props.pace >= 50) && (this.props.pace < 80)) {
  		paceInfo = (<p className="yellow-txt">Your talking pace was slightly slow. Be sure not to have too many pauses. </p>);
  	} else if ((this.props.pace >= 80) && (this.props.pace < 120)) {
  		paceInfo = (<p className="green-txt">Excellent talking pace. Keep it up!</p>);
  	} else if ((this.props.pace >= 120) && (this.props.pace < 150)) {
  		paceInfo = (<p className="yellow-txt">Your talking pace was slightly fast. Try slowing down a little.</p>);
  	} else {
  		paceInfo = (<p className="red-txt">You're talking way too fast! Try slowing down. </p>);
  	}

    if (this.props.pace > 5) {
      return (
        <div>
          <p>Pace: {Math.round(this.props.pace)} Words per Minute</p>
          {paceInfo}
        </div>
      )
    } else {
      return (
        <div>
          <p className="red-txt">We couldn't detect any words from your speech. Double check your microphone and try again.</p>
        </div>
      )
    }

    
  }
}




