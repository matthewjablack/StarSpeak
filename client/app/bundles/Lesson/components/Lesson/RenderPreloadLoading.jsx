import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RenderPreload from './RenderPreload';

export default class RenderPreloadLoading extends Component{

  constructor(props) {
    super(props);
    this.state = {
      affectivaLoaded: false
    };
  }

  render() {
    return(
      <RenderPreload
        affectivaLoaded={this.state.affectivaLoaded} 
      />
    )
  }
}
