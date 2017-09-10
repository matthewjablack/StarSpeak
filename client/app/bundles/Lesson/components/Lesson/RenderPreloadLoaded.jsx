import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RenderPreload from './RenderPreload';

export default class RenderPreloadLoaded extends Component{

  constructor(props) {
    super(props);
    this.state = {
      affectivaLoaded: true
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
