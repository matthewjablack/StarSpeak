import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CollapsibleItem} from '@mblackmblack/react-materialize'

export default class Pace extends Component {
  render() {
  	let paceHeader, icon, className;
    if ((this.props.pace > 5) && (this.props.pace < 50)) {
  		paceHeader = "Your talking pace was very slow. Try working on reducing your pauses.";
      icon = "error";
      className = "red-txt";
  	} else if ((this.props.pace >= 50) && (this.props.pace < 120)) {
  		paceHeader = "Your talking pace was slightly slow. Be sure not to have too many pauses.";
      icon = "warning";
      className = "yellow-txt";
  	} else if ((this.props.pace >= 120) && (this.props.pace < 150)) {
  		paceHeader = "Excellent talking pace. Keep it up!";
      icon = "done";
      className = "green-txt";
  	} else if ((this.props.pace >= 150) && (this.props.pace < 200)) {
  		paceHeader = "Your talking pace was slightly fast. Try slowing down a little.";
      icon = "warning";
      className = "yellow-txt";
  	} else {
  		paceHeader = "You're talking way too fast! Try slowing down."
      icon = "error";
      className = "red-txt";
  	}

    const { children, ...other } = this.props;

    if (this.props.pace > 5) {
      return (
          <CollapsibleItem className={className} header={paceHeader} icon={icon} {...other}>
            Your talking pace was {this.props.pace} words per minute. {children}
          </CollapsibleItem>
      )
    } else {
      return (
          <CollapsibleItem className="red-txt" header="We couldn't detect any words from your speech." icon='error' {...other}>
            Double check your microphone and try again.
          </CollapsibleItem>
      )
    }


  }
}
