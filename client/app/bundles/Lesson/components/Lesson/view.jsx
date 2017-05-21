import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';

// export default class RenderIntro extends Component{
//   render() {
//     return (
//       <div className="frontPg">
//         <h1 className="white">Welcome to StarSpeak</h1>
//         <h2 className="white">Helping students to embrace their presentation.</h2>
//         <br/>
//         <p>&nbsp;</p>
//         <button className="whiteBtn" onClick={this.props.startStageAdjust}>Start</button>
//       </div>
//     )
//   }
// }

// export default RenderIntro;

// export function RenderIntro(props) {
//   return (
//     <div className="frontPg">
//       <h1 className="white">Welcome to StarSpeak</h1>
//       <h2 className="white">Helping students to embrace their presentation.</h2>
//       <br/>
//       <p>&nbsp;</p>
//       <button className="whiteBtn" onClick={props.startStageAdjust}>Start</button>
//     </div>
//   )
// }

// RenderIntro.propTypes = {
//   startStageAdjust: React.PropTypes.number.isRequired,
// };

export default class RenderAdjust extends Component {
  render() {
    return (
      <div>
        <div className="centerFixed">
          <h2 className="white">Adjust your camera</h2>
          <button className="whiteBtn" onClick={this.props.startStageDevelop}>Ready</button>
        </div>
        <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.props.width} height={this.props.width * 0.75}/>
      </div>
    )
  }
}

// export function RenderAdjust(props) {
//   return (
//     <div>
//       <div className="centerFixed">
//         <h2 className="white">Adjust your camera</h2>
//         <button className="whiteBtn" onClick={props.startStageDevelop}>Ready</button>
//       </div>
//       <Webcam audio={false} className="reactWebcam" ref='webcam' width={props.width} height={props.width * 0.75}/>
//     </div>
//   )
// }

// RenderAdjust.propTypes = {
//   startStageDevelop: React.PropTypes.number.isRequired,
//   width: React.PropTypes.number.isRequired,
// };


