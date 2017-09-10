import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';
import FontAwesome from 'react-fontawesome';
import $ from 'jquery'
import Slider from 'react-slick';

export default class RenderPreload extends Component {

  constructor(props) {
    super(props)
    this.state = {
      countDown: 3
    };
    this.setCountDown = this.setCountDown.bind(this);
  }

  componentDidMount() {
    this.setCountDown();
  }

  setCountDown() {
    var _this = this;
    var interval = 1000;
    var expected = Date.now() + interval;
    setTimeout(step, interval);
    function step() {
      var dt = Date.now() - expected;
      if (dt > interval) {
        console.log('Error in browser detected');
      }

      if (_this.props.affectivaLoaded) {
        if (_this.state.countDown === 1) {
          console.log('start stage record');
          _this.props.startStageRecord();
        } else {
          _this.setState({countDown: _this.state.countDown - 1});
          expected += interval;
          setTimeout(step, Math.max(0, interval - dt)); // take into account drift
        }
      } else {
        expected += interval;
        setTimeout(step, Math.max(0, interval - dt)); // take into account drift
      }
    }
  }

  render() {
    var settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000
    };

    let preloadContent;
    if (this.props.affectivaLoaded) {
      preloadContent = (
        <div>
          <h2>Get ready to present in:</h2>
          <h1 style={{fontSize: 90}}>{this.state.countDown}</h1>
        </div>
      );
    } else {
      preloadContent = (
        <div>
          <p style={{height: $(window).height()/3 + 20, fontSize: $(window).height()/6, marginTop: 0.5 * $(window).height()/6}}>
            <FontAwesome
              className='super-crazy-colors'
              name='refresh'
              size='3x'
              spin={true}
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', marginLeft: -1.2 * $(window).height()/6 }}
            />
          </p>
          <Slider {...settings}>
            <div><h3>Turning on the lights</h3></div>
            <div><h3>Setting the stage</h3></div>
            <div><h3>Testing the mic</h3></div>
            <div><h3>Checking the speakers</h3></div>
            <div><h3>Opening the curtains</h3></div>
            <div><h3>Prepping the audience</h3></div>
            <div><h3>Taking a deep breath</h3></div>
          </Slider>
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
