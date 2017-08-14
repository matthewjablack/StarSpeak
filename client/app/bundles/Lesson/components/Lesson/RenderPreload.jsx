import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import { Button } from '@mblackmblack/react-materialize';

export default class RenderPreload extends Component {


  constructor(props) {
    super(props)
    this.state = {

      emotionImgUrlList: {
        'happy0': '/images/emotion_list/happy/happy_0.png',
        'happy1': '/images/emotion_list/happy/happy_1_grey.png',
        'happy2': '/images/emotion_list/happy/happy_2_grey.png',
        'happy3': '/images/emotion_list/happy/happy_3_grey.png',

        'sad0': '/images/emotion_list/sad/sad_0.png',
        'sad1': '/images/emotion_list/sad/sad_1_grey.png',
        'sad2': '/images/emotion_list/sad/sad_2_grey.png',
        'sad3': '/images/emotion_list/sad/sad_3_grey.png',

        'excited0': '/images/emotion_list/excited/excited_0.png',
        'excited1': '/images/emotion_list/excited/excited_1_grey.png',
        'excited2': '/images/emotion_list/excited/excited_2_grey.png',
        'excited3': '/images/emotion_list/excited/excited_3_grey.png',

        'angry0': '/images/emotion_list/angry/angry_0.png',
        'angry1': '/images/emotion_list/angry/angry_1_grey.png',
        'angry2': '/images/emotion_list/angry/angry_2_grey.png',
        'angry3': '/images/emotion_list/angry/angry_3_grey.png',
      }
    }
  }

  setElements() {
    this.setEmotionForms();
    this.emotionForm = (
      <div>
      <h2> What kind of emotions do you wish to portray? </h2>
        {this.formList.map(form => <div> {form} <br></br> </div>)}
      </div>
      )
    if (this.props.affectivaLoaded) {
      this.speechAnalyticsSection = (
        <div>
          <p>loaded!</p>
          <Button className="red lighten-2" waves="light" onClick={() => this.props.startStageRecord}>
            continue
          </Button>
        </div>
      )
    } else {
      this.speechAnalyticsSection = (
        <p>Loading...</p>
      )
    }
  }

  setEmotionForms() {

    this.formList = [];

    this.emList = ['happy', 'sad', 'excited', 'angry']

    for (let j = 0; j < 4; j++) {
      let emotion = this.emList[j]
      this.formList.push((
        <div>
        <h3>{emotion}:    </h3>
          <img src={this.state.emotionImgUrlList[emotion+0]} style={{width: 50, height: 50}} onClick={() => this.onEmotionGoalChange(emotion, 0)} />
          <span> ----------- </span>
          <img src={this.state.emotionImgUrlList[emotion+1]} style={{width: 50, height: 50}} onClick={() => this.onEmotionGoalChange(emotion, 1)} />
          <span> ----------- </span>
          <img src={this.state.emotionImgUrlList[emotion+2]} style={{width: 50, height: 50}} onClick={() => this.onEmotionGoalChange(emotion, 2)} />
          <span> ----------- </span>
          <img src={this.state.emotionImgUrlList[emotion+3]} style={{width: 50, height: 50}} onClick={() => this.onEmotionGoalChange(emotion, 3)} />
        </div>
      ))
    }
  }

  onEmotionGoalChange(emotionType, value) {
    this.setColour(emotionType, value)
    this.setEmotionValue(emotionType, value)
  }

  setColour(emotionType, value) {
    let newEmotionImgUrlList = Object.assign({}, this.state.emotionImgUrlList)

    for (var i = 0; i <= 3; i++) {
      var grey = ""
      var imgUrl = "/images/emotion_list/"
      if (i !== value) {
        grey = "_grey"
      }
      imgUrl =imgUrl + emotionType + '/' + emotionType + '_' + i + grey + ".png"
      newEmotionImgUrlList[emotionType+i] = imgUrl
    }
    this.setState({
      emotionImgUrlList: newEmotionImgUrlList
    })
  }

  setEmotionValue() {
    // TODO: set the emotion value to the Lesson.jsx state
  }


  render() {
    this.setElements();


    /* TODO: 'children' removable? */
    return (
      <div>
        <div className="centerFixed">
        {this.emotionForm}
        {this.speechAnalyticsSection}

        </div>
        {this.props.children}
      </div>
    )
  }
}
