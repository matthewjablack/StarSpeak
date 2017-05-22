import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { ProgressBar, Col, Row } from 'react-bootstrap';
import {Progress} from './progress';

export function Stats(props) {

  if (props.stage === 'Analyze') {
    return (
      <div>
      <Row>
        <Col md={4}>
          <h2>Personality</h2>
          <FontAwesome
            className='refresh'
            name='refresh'
            size='2x'
            spin
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
          />
        </Col>
        <Col md={4}>
          <h2>Speech Emotions</h2>
          <FontAwesome
            className='refresh'
            name='refresh'
            size='2x'
            spin
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
          />
        </Col>
        <Col md={4}>
          <h2>Facial Emotions</h2>
          <FontAwesome
            className='refresh'
            name='refresh'
            size='2x'
            spin
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <h2>Emotion Tone</h2>
          <FontAwesome
            className='refresh'
            name='refresh'
            size='2x'
            spin
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
          />
        </Col>
        <Col md={4}>
          <h2>Language Tone</h2>
          <FontAwesome
            className='refresh'
            name='refresh'
            size='2x'
            spin
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
          />
        </Col>
        <Col md={4}>
          <h2>Social Tone</h2>
          <FontAwesome
            className='refresh'
            name='refresh'
            size='2x'
            spin
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
          />
        </Col>
      </Row>
      </div>
    )
  } else {
    return (
      <div>
      <Row>
        <Col md={4}>
          <h2>Personality</h2>
          <p>Agreeableness</p>
          <Progress value={props.indico.personality.agreeableness} />
          <p>Conscientiousness</p>
          <Progress value={props.indico.personality.conscientiousness} />
          <p>Extraversion</p>
          <Progress value={props.indico.personality.extraversion} />
          <p>Openness</p>
          <Progress value={props.indico.personality.openness} />
        </Col>
        <Col md={4}>
          <h2>Speech Emotions</h2>
          <p>Happy</p>
          <Progress value={props.indico.speechEmotion.happy} />
          <p>Sad</p>
          <Progress value={props.indico.speechEmotion.sad} />
          <p>Angry</p>
          <Progress value={props.indico.speechEmotion.angry} />
          <p>Fear</p>
          <Progress value={props.indico.speechEmotion.fear} />
          <p>Surprise</p>
          <Progress value={props.indico.speechEmotion.surprise} />
        </Col>
        <Col md={4}>
          <h2>Facial Emotions</h2>
          <p>Happy</p>
          <Progress value={props.indico.facialEmotion.happy} />
          <p>Sad</p>
          <Progress value={props.indico.facialEmotion.sad} />
          <p>Angry</p>
          <Progress value={props.indico.facialEmotion.angry} />
          <p>Fear</p>
          <Progress value={props.indico.facialEmotion.fear} />
          <p>Surprise</p>
          <Progress value={props.indico.facialEmotion.surprise} />
          <p>Neutral</p>
          <Progress value={props.indico.facialEmotion.neutral} />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <h2>Emotion Tone</h2>
          <p>Anger</p>
          <Progress value={props.watson.tone.emotionTone.anger} />
          <p>Disgust</p>
          <Progress value={props.watson.tone.emotionTone.disgust} />
          <p>Fear</p>
          <Progress value={props.watson.tone.emotionTone.fear} />
          <p>Joy</p>
          <Progress value={props.watson.tone.emotionTone.joy} />
          <p>Sadness</p>
          <Progress value={props.watson.tone.emotionTone.sadness} />
        </Col>
        <Col md={4}>
          <h2>Language Tone</h2>
          <p>Analytical</p>
          <Progress value={props.watson.tone.languageTone.analytical} />
          <p>Confident</p>
          <Progress value={props.watson.tone.languageTone.confident} />
          <p>Tentative</p>
          <Progress value={props.watson.tone.languageTone.tentative} />
        </Col>
        <Col md={4}>
          <h2>Social Tone</h2>
          <p>Openness</p>
          <Progress value={props.watson.tone.socialTone.openness} />
          <p>Conscientiousness</p>
          <Progress value={props.watson.tone.socialTone.conscientiousness} />
          <p>Extraversion</p>
          <Progress value={props.watson.tone.socialTone.extraversion} />
          <p>Agreeableness</p>
          <Progress value={props.watson.tone.socialTone.agreeableness} />
          <p>Emotional Range</p>
          <Progress value={props.watson.tone.socialTone.emotionalRange} />
        </Col>
      </Row>
      </div>
    )
  }
}

Stats.propTypes = {
  indico: React.PropTypes.object.isRequired,
  stage: React.PropTypes.string.isRequired,
};
