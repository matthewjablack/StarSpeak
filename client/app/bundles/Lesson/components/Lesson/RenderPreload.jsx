import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';
import FontAwesome from 'react-fontawesome';
import $ from 'jquery'

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
          <p style={{height: '20px', fontSize: $(window).height()/6, marginTop: 0.5 * $(window).height()}}>
            <FontAwesome
              className='super-crazy-colors'
              name='refresh'
              size='3x'
              spin={true}
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', marginLeft: -1.2 * $(window).height()/6 }}
            />
          </p>
        </div>
      );
    }

    return (
      <div>
        <div className="centerFixed full-height">
          {preloadContent}
        </div>
        {this.props.children}
      </div>
    )
  }
}
