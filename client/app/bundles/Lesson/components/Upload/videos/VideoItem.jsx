import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class VideoItem extends Component{
  static propTypes = {
    video: PropTypes.object.isRequired
  };

  render() {
    return (
      <li>
        <a href={this.props.video.url}>{this.props.video.upload_file_name}</a>
      </li>
    )
  }

}
