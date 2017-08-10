import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CollapsibleItem} from '@mblackmblack/react-materialize'

export default class UmCount extends Component {
  render() {
    const { ...other } = this.props;

    if (this.props.umCount > 0) {
      return (
          <CollapsibleItem className="red-txt" header='Watch out for hesitations' icon='error' {...other}>
            <p className="red-txt">We noticed you had {this.props.umCount} hesitations in your speech ("huh", "uh", "erm", "um").</p>
          </CollapsibleItem>
      )
    } else {
      return (
        <CollapsibleItem className="green-txt" header='No hesitations, Great job!' icon='done' {...other}>
          <p>We didn't find any hesitations in your speech ("huh", "uh", "erm", "um").</p>
          <p>Keep up the great work!</p>
        </CollapsibleItem>
      )
    }
  }
}
