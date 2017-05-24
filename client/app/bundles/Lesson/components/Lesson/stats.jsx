import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { ProgressBar, Card, Col, Row } from 'react-materialize';
import {Rating} from 'react-rating';

function pacePercentage(pace) {
  let score = 0;
  if ((pace > 5) && (pace < 50)) {
    score = 20;
  } else if ((pace >= 50) && (pace < 80)) {
    score = 60;
  } else if ((pace >= 80) && (pace < 120)) {
    score = 100;
  } else if ((pace >= 120) && (pace < 150)) {
    score = 60;
  } else {
    score = 20;
  }
  return score;
}

export function Stats(props) {

  if (props.stage === 'Analyze') {
    return (
      <div>
        <Row>
          <Col m={3}>
            <h2>Emotion Tone</h2>
            <FontAwesome
              className='refresh'
              name='refresh'
              size='2x'
              spin
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
            />
          </Col>
          <Col m={3}>
            <h2>Language Tone</h2>
            <FontAwesome
              className='refresh'
              name='refresh'
              size='2x'
              spin
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
            />
          </Col>
          <Col m={3}>
            <h2>Social Tone</h2>
            <FontAwesome
              className='refresh'
              name='refresh'
              size='2x'
              spin
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
            />
          </Col>
          <Col m={3}>
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
      </div>
    )
  } else {
    return (
      <div>
        <Row>
          <Card className="hoverable center">
            <h3>Summary Card</h3>
            <h5>{props.user.name}</h5>
            <img src={props.screenshot} style={{objectFit: 'cover', borderRadius:100, width: 150, height: 150}}/>
            <h5>Score {Math.round((props.watson.tone.language.confident/2)* 100 + pacePercentage(props.local.pace)/2 )}%</h5>
          </Card>
        </Row>
        <Row>
          <Col m={6} s={12}>
            <Card className="hoverable">
              <h3>Emotion Tone</h3>
              <p>Joy</p>
              <ProgressBar className="red" progress={props.watson.tone.emotion.joy * 100} />
              <p>Fear</p>
              <ProgressBar className="red" progress={props.watson.tone.emotion.fear * 100} />
              <p>Sadness</p>
              <ProgressBar className="red" progress={props.watson.tone.emotion.sadness * 100} />
              <p>Disgust</p>
              <ProgressBar className="red" progress={props.watson.tone.emotion.disgust * 100} />
              <p>Anger</p>
              <ProgressBar className="red" progress={props.watson.tone.emotion.anger * 100} />
              <Rating
                empty="fa fa-star-o fa-2x"
                full="fa fa-star fa-2x"
                onChange={(rate) => updateRating('emotion_tone_rating', rate, props.user) || ''}
              />
            </Card>
          </Col>
          <Col m={6} s={12}>
            <Card className="hoverable">
              <h3>Language Tone</h3>
              <p>Analytical</p>
              <ProgressBar className="red" progress={props.watson.tone.language.analytical * 100} />
              <p>Confident</p>
              <ProgressBar className="red" progress={props.watson.tone.language.confident * 100} />
              <p>Tentative</p>
              <ProgressBar className="red" progress={props.watson.tone.language.tentative * 100} />
              <Rating
                empty="fa fa-star-o fa-2x"
                full="fa fa-star fa-2x"
                onChange={(rate) => updateRating('language_tone_rating', rate, props.user) || ''}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col m={6} s={12}>
            <Card className="hoverable">
              <h3>Social Tone</h3>
              <p>Openness</p>
              <ProgressBar className="red" progress={props.watson.tone.social.openness * 100} />
              <p>Conscientiousness</p>
              <ProgressBar className="red" progress={props.watson.tone.social.conscientiousness * 100} />
              <p>Extraversion</p>
              <ProgressBar className="red" progress={props.watson.tone.social.extraversion * 100} />
              <p>Agreeableness</p>
              <ProgressBar className="red" progress={props.watson.tone.social.agreeableness * 100} />
              <p>Emotional Range</p>
              <ProgressBar className="red" progress={props.watson.tone.social.emotionalRange * 100} />
              <Rating
                empty="fa fa-star-o fa-2x"
                full="fa fa-star fa-2x"
                onChange={(rate) => updateRating('social_tone_rating', rate, props.user) || ''}
              />
            </Card>
          </Col>
          <Col m={6} s={12}>
            <Card className="hoverable">
              <h3>Facial Emotions</h3>
              <p>Happy</p>
              <ProgressBar className="red" progress={props.indico.facialEmotion.happy * 100} />
              <p>Sad</p>
              <ProgressBar className="red" progress={props.indico.facialEmotion.sad * 100} />
              <p>Angry</p>
              <ProgressBar className="red" progress={props.indico.facialEmotion.angry * 100} />
              <p>Fear</p>
              <ProgressBar className="red" progress={props.indico.facialEmotion.fear * 100} />
              <p>Surprise</p>
              <ProgressBar className="red" progress={props.indico.facialEmotion.surprise * 100} />
              <p>Neutral</p>
              <ProgressBar className="red" progress={props.indico.facialEmotion.neutral * 100} />
              <Rating
                empty="fa fa-star-o fa-2x"
                full="fa fa-star fa-2x"
                onChange={(rate) => updateRating('facial_emotions_rating', rate, props.user) || ''}
              />
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

Stats.propTypes = {
  indico: PropTypes.object.isRequired,
  stage: PropTypes.string.isRequired,
};
