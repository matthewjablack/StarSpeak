import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-materialize';


export default class RenderDemoExceeded extends Component {
  render() {
    return (
      <div className="bgWhite">
        <div className="container">
          <h2>Oh Snap!</h2>
          <p>Looks like you used up all your StarLight demos. </p>
          <Button className="red lighten-2" waves="light" href="/users/sign_in">Sign In</Button>
           &nbsp;  &nbsp;
          <Button className="red lighten-2" waves="light" href="/users/sign_up">Sign Up</Button>
          {this.props.children}
        </div>
      </div>
    )
  }
}
