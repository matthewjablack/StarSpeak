import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class UmCount extends Component {
  render() {
    if (this.props.umCount > 0) {
      return (
        <div>
          <p className="red-txt">We noticed you had some hesitations in your speech ("huh", "uh", "erm", "um").</p>
          <p className="red-txt">Hesitations: {this.props.umCount}</p>
        </div>
      )
    } else {
      return (
        <div>
          <p className="green-txt">Great job. No hesitations detected.</p>
        </div>
      )
    }
  }
}
