import React, {Component} from 'react';
import PropTypes from 'prop-types';
import VideoItem from './VideoItem';

export default class VideosList extends Component{
  static propTypes = {
    videos: PropTypes.array.isRequired
  };

  render() {
    const videoItems = this.props.videos.map((video) =>
      <VideoItem key={video.id} video={video} />
    );

    return (
      <ul>
        {videoItems}
      </ul>
    )
  }

}
