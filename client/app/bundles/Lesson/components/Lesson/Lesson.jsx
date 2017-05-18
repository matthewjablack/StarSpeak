import PropTypes from 'prop-types';
import React from 'react';
import {Icon, Tabs, Pane, Alert} from 'watson-react-components';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import recognizeFile from 'watson-speech/speech-to-text/recognize-file';
import {Transcript} from './transcript.jsx';
import {Keywords, getKeywordsSummary} from './keywords.jsx';
import {SpeakersView} from './speaker.jsx';
import {TimingView} from './timing.jsx';
import Webcam from 'react-webcam';
import FontAwesome from 'react-fontawesome';
import samples from './samples.json';
import { ProgressBar, Col, Row } from 'react-bootstrap';
import JSONView from './json-view';
import SpeechToText from 'speech-to-text';
import browser from 'detect-browser';
import {formatSeconds, formatDigit} from './format-time';
import {paramsObject, isObjectEmpty} from './params';


var k = [
  "016fe87430f6925ba984a78f83b93fe1",
];

var etype = ['Happy', 'Sad', 'Angry', 'Fear', 'Surprise'];

var screenshots = [];

var screenCount = 0;


const ERR_MIC_NARROWBAND = 'Microphone transcription cannot accommodate narrowband voice models, please select a broadband one.';

export default class Lesson extends React.Component{
  static propTypes = {
    lesson: PropTypes.object.isRequired,
    moduler: PropTypes.object.isRequired,
    level: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      model: 'en-US_BroadbandModel',
      rawMessages: [],
      formattedMessages: [],
      audioSource: null,
      speakerLabels: false,
      keywords: this.getKeywords('en-US_BroadbandModel'),
      settingsAtStreamStart: {
        model: '',
        keywords: [],
        speakerLabels: false
      },
      error: null,
      screenshot: null,
      tab: 0,
      stage: 0,
      count1: 2,
      count2: 20,
      count3: 4,
      txtSpeak: true,
      readability: null,
      happy: 0.00,
      sad: 0.00,
      angry: 0.00,
      fear: 0.00,
      surprise: 0.00,
      neutral: 0.00,
      eCount: 0,
      screenshot: [],
      screenCount: 0,
      analyzing: false,
      analyzed: 0,
      happy2: 0.00,
      sad2: 0.00,
      angry2: 0.00,
      fear2: 0.00,
      surprise2: 0.00,
      confidence: 0.00,
      agreeableness: 0.00,
      conscientiousness: 0.00,
      extraversion: 0.00,
      openness: 0.00,
      msg: "",
      width: '0', 
      height: '0',
      lesson_name: '', 
      lesson_id: 0,
      level_id: 0,
      moduler_id: 0,
      content: '', 
      length: 20,
      prep: 10,
      auth_token: null,
      user_id: 0,
      betacode_id: 0,
      lesson: this.props.lesson,
      moduler: this.props.moduler,
      level: this.props.level,
      user: this.props.user,
      localText: "", 
      interimText: "", 
      pace: 0, 
    };

    this.handleFormattedMessage = this.handleFormattedMessage.bind(this);
    this.handleRawdMessage = this.handleRawdMessage.bind(this);
    this.handleTranscriptEnd = this.handleTranscriptEnd.bind(this);
    this.handleMicClick = this.handleMicClick.bind(this);
    this.stopTranscription = this.stopTranscription.bind(this);
    this.fetchToken = this.fetchToken.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleLocalStream = this.handleLocalStream.bind(this)
  }

  componentDidMount() {
    this.fetchToken();

    if (!isObjectEmpty(paramsObject())) {
      this.setState({stage: 1})
      this.fetchLesson(paramsObject().auth_token, paramsObject().lesson_id);
    } else if (!isObjectEmpty(this.state.lesson)) {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Please download the latest version of Google Chrome");
        history.go(-1);
      }
      this.setState({stage: 1, count2: this.state.lesson.length, length: this.state.lesson.length, auth_token: this.state.user.auth_token})
    }

    this.setState({'tokenInterval' : setInterval(this.fetchToken, 50 * 60 * 1000) });

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));

    setInterval(() => {
      if (this.state.stage == 3 && this.state.count2 > 0) {
        this.setState({ count2: this.state.count2 - 1 });
      } else if (this.state.stage == 3 && this.state.count2 == 0) {
        this.setState({stage: 4});
        this.handleMicClick();
      }
      if (this.state.stage == 3 && this.state.count3 > 0) {
        this.setState({ count3: this.state.count3 - 1 });
      } else if (this.state.stage == 3 && this.state.count3 == 0) {
        this.setState({txtSpeak: false});
      }
      if (this.state.stage == 4 && this.state.readability == null) {
        this.setState({readability: false});

        const messages = this.getFinalAndLatestInterimResult();
        let full_message = "";

        messages.forEach(function(msg) {
          msg.results.forEach(function(result) {
            full_message += result.alternatives[0].transcript;
          })
        })
      }

      if (this.state.count2 % 2 == 0 && this.state.stage == 3) {
        let screenshot = this.refs.webcam.getScreenshot();
        screenshots[screenCount] = screenshot;
        screenCount += 1;
      }

      if (this.state.analyzing == false && this.state.stage == 4) {
        const messages = this.getFinalAndLatestInterimResult();
        let full_message = "";

        messages.forEach(function(msg) {
          msg.results.forEach(function(result) {
            full_message += result.alternatives[0].transcript;
          })
        })
        this.startAnalyzing(this.state.localText);
      }
    }, 1000)
    
  }

  componentWillUnmount() {
    clearInterval(this.state.tokenInterval);
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  reset() {
    if (this.state.audioSource) {
      this.stopTranscription();
    }
    this.setState({rawMessages: [], formattedMessages: [], error: null});
  }

  captureSettings() {
    this.setState({
      settingsAtStreamStart: {
        model: this.state.model,
        keywords: this.getKeywordsArr(),
        speakerLabels: this.state.speakerLabels
      }
    });
  }

  stopTranscription() {
    this.stream && this.stream.stop();
    this.setState({audioSource: null});
  }

  getRecognizeOptions(extra) {
    var keywords = this.getKeywordsArr();
    return Object.assign({
      token: this.state.token, smart_formatting: true, // formats phone numbers, currency, etc. (server-side)
      format: true, // adds capitals, periods, and a few other things (client-side)
      model: this.state.model,
      objectMode: true,
      interim_results: true,
      continuous: true,
      word_alternatives_threshold: 0.01, // note: in normal usage, you'd probably set this a bit higher
      keywords: keywords,
      keywords_threshold: keywords.length
        ? 0.01
        : undefined, // note: in normal usage, you'd probably set this a bit higher
      timestamps: true, // set timestamps for each word - automatically turned on by speaker_labels
      speaker_labels: this.state.speakerLabels, // includes the speaker_labels in separate objects unless resultsBySpeaker is enabled
      resultsBySpeaker: this.state.speakerLabels, // combines speaker_labels and results together into single objects, making for easier transcript outputting
      speakerlessInterim: this.state.speakerLabels // allow interim results through before the speaker has been determined
    }, extra);
  }

  handleMicClick() {
    if (this.state.audioSource === 'mic') {
      return this.stopTranscription();
    }
    this.reset();
    this.setState({audioSource: 'mic'});
    this.handleStream(recognizeMicrophone(this.getRecognizeOptions()));
  }

  handleLocalStream() {
    const onAnythingSaid = text => {
      if (this.state.stage == 3) {
        this.setState({interimText: text});
        console.log(`Interim text: ${text}`);
      }
    }
    
    const onFinalised = text => {
      if (this.state.stage == 3) {
        this.setState({localText: text});
        console.log(`Finalised text: ${text}`);
      }
    }
     
    try {
      const listener = new SpeechToText(onAnythingSaid, onFinalised);
      listener.startListening();
    } catch (error) {
      console.log(error);
    }
  }

  handleStream(stream) {
    if (this.stream) {
      this.stream.stop();
      this.stream.removeAllListeners();
      this.stream.recognizeStream.removeAllListeners();
    }
    this.stream = stream;
    this.captureSettings();

    stream.on('data', this.handleFormattedMessage).on('end', this.handleTranscriptEnd).on('error', this.handleError);

    stream.recognizeStream.on('end', () => {
      if (this.state.error) {
        this.handleTranscriptEnd();
      }
    });

    stream.recognizeStream
      .on('message', (frame, json) => this.handleRawdMessage({sent: false, frame, json}))
      .on('send-json', json => this.handleRawdMessage({sent: true, json}))
      .once('send-data', () => this.handleRawdMessage({
        sent: true, binary: true, data: true // discard the binary data to avoid waisting memory
      }))
      .on('close', (code, message) => this.handleRawdMessage({close: true, code, message}));
  }

  handleRawdMessage(msg) {
    this.setState({rawMessages: this.state.rawMessages.concat(msg)});
  }

  handleFormattedMessage(msg) {
    this.setState({formattedMessages: this.state.formattedMessages.concat(msg)});
  }

  handleTranscriptEnd() {
    this.setState({audioSource: null})
  }

  async fetchLesson(auth_token, lesson_id) {
    let response = await fetch('https://starspeak.io/api/v1/lesson/'+ lesson_id +'.json?auth_token=' + auth_token, {
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    })

    let responseJson = await response.json();

    this.setState({
      lesson_name: responseJson.lesson.name,
      lesson_id: responseJson.lesson.id,
      level_id: responseJson.lesson.level_id,
      moduler_id: responseJson.lesson.moduler_id,
      content: responseJson.lesson.content, 
      length: responseJson.lesson.length,
      prep: responseJson.lesson.prep,
      user_id: responseJson.user.id,
      betacode_id: responseJson.betacode.id,
      auth_token: auth_token,
      count: responseJson.lesson.prep,
      count2: responseJson.lesson.length,
    })
  }

  

  fetchToken() {
    return fetch('https://view.starspeak.io/api/token').then(res => {
      if (res.status != 200) {
        throw new Error('Error retrieving auth token');
      }
      return res.text();
    }). // todo: throw here if non-200 status
    then(token => this.setState({token})).catch(this.handleError);
  }

  getKeywords(model) {
    const files = samples[model];
    return files && files.length >= 2 && files[0].keywords + ', ' + files[1].keywords || '';
  }

  getKeywordsArr() {
    return this.state.keywords.split(',').map(k => k.trim()).filter(k => k);
  }

  getFinalResults() {
    return this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final);
  }

  getCurrentInterimResult() {
    const r = this.state.formattedMessages[this.state.formattedMessages.length - 1];
    if (!r || !r.results || !r.results.length || r.results[0].final) {
      return null;
    }
    return r;
  }

  getFinalAndLatestInterimResult() {
    const final = this.getFinalResults();
    const interim = this.getCurrentInterimResult();
    if (interim) {
      final.push(interim);
    }
    return final;
  }

  handleError(err, extra) {
    console.error(err, extra);
    if (err.name == 'UNRECOGNIZED_FORMAT') {
      err = 'Unable to determine content type from file header; only wav, flac, and ogg/opus are supported. Please choose a different file.';
    } else if (err.name === 'NotSupportedError' && this.state.audioSource === 'mic') {
      err = 'This browser does not support microphone input.';
    } else if (err.message === '(\'UpsamplingNotAllowed\', 8000, 16000)') {
      err = 'Please select a narrowband voice model to transcribe 8KHz audio files.';
    }
    this.setState({ error: err.message || err });
  }

  startStage1() {
    this.setState({stage: 1});
  }

  startStage2() {
    this.setState({stage: 2});
  }

  startStage3() {
    this.setState({stage: 3});
    this.handleMicClick();
    this.handleLocalStream();
  }

  startStage4() {
    if (this.state.localText === "") {
      this.setState({localText: this.state.interimText});
    }
    this.setState({stage: 4, length: this.state.length - this.state.count2});
    this.handleMicClick();
  }

  async startAnalyzing(txt) {
    const pace = (60 / this.state.length) * txt.split(" ").length;
    this.setState({pace: pace});

    this.setState({analyzing: true});
    for (var i = 0; i < screenCount; i++) {
      let response = await fetch('https://apiv2.indico.io/fer', {
        method: 'POST',
        body: JSON.stringify({
          'api_key': k[Math.floor(Math.random()*k.length)],
          'data': screenshots[i],
          'detect': true
        })
      })

      let responseJson = await response.json();

      if (responseJson.results[0] && typeof responseJson.results[0].emotions != 'undefined') {

        var emotions = responseJson.results[0].emotions;
        var count = this.state.eCount + 1;
        this.setState({
          eCount: this.state.eCount + 1,
          happy: (this.state.happy * (count-1) + emotions['Happy']) / count,
          sad: (this.state.sad * (count-1) + emotions['Sad']) / count,
          angry: (this.state.angry * (count-1) + emotions['Angry']) / count,
          fear: (this.state.fear * (count-1) + emotions['Fear']) / count,
          surprise: (this.state.surprise * (count-1) + emotions['Surprise']) / count,
          neutral: (this.state.neutral * (count-1) + emotions['Neutral']) / count,
          analyzed: this.state.analyzed + 1,
        })
      }
    }

    let response = await fetch('https://apiv2.indico.io/emotion ', {
      method: 'POST',
      body: JSON.stringify({
        'api_key': k[Math.floor(Math.random()*k.length)],
        "data": txt,
        'threshold': 0.1
      })
    })

    let responseJson = await response.json();

    if (responseJson.results) {
      var emotions = responseJson.results;
      this.setState({
          happy2: emotions['joy'],
          sad2: emotions['sadness'],
          angry2: emotions['anger'],
          fear2: emotions['fear'],
          surprise2: emotions['surprise'],
        })
    }

    let response2 = await fetch('https://apiv2.indico.io/personality ', {
      method: 'POST',
      body: JSON.stringify({
        'api_key':k[Math.floor(Math.random()*k.length)],
        "data": txt
      })
    })

    let responseJson2 = await response2.json();

    if (responseJson2.results) {
      var emotions = responseJson2.results;

      this.setState({
          agreeableness: emotions['agreeableness'],
          conscientiousness: emotions['conscientiousness'],
          extraversion: emotions['extraversion'],
          openness: emotions['openness'],
        })
    }

    this.setState({
      confidence: (this.state.agreeableness + this.state.conscientiousness + this.state.extraversion + this.state.openness + this.state.happy + this.state.happy2 + this.state.sad + this.state.sad2 - this.state.fear - this.state.fear2) / 6
    })

    this.setState({stage: 5})
    const messages = this.getFinalAndLatestInterimResult();
    let full_message = "";

    messages.forEach(function(msg) {
      msg.results.forEach(function(result) {
        full_message += result.alternatives[0].transcript;
      })
    })

    if (this.state.auth_token !== null) {
      let response3 = await fetch(
        '/api/v1/speechstats.json?auth_token=' + this.state.auth_token +
        '&user_id=' + this.state.user.id +
        '&betacode_id=' + this.state.user.betacode_id + 
        '&lesson_id=' + this.state.lesson.id + 
        '&moduler_id=' + this.state.moduler.id + 
        '&happy_facial_indico=' + this.state.happy + 
        '&sad_facial_indico=' + this.state.sad + 
        '&angry_facial_indico=' + this.state.angry + 
        '&fear_facial_indico=' + this.state.fear + 
        '&surprise_facial_indico=' + this.state.surprise + 
        '&neutral_facial_indico=' + this.state.neutral + 
        '&happy_speech_indico=' + this.state.happy2 + 
        '&sad_speech_indico=' + this.state.sad2 + 
        '&angry_speech_indico=' + this.state.angry2 + 
        '&fear_speech_indico=' + this.state.fear2 + 
        '&surprise_speech_indico=' + this.state.surprise2 + 
        '&agreeableness_indico=' + this.state.agreeableness + 
        '&conscientiousness_indico=' + this.state.conscientiousness + 
        '&extraversion_indico=' + this.state.extraversion + 
        '&openness_indico=' + this.state.openness + 
        '&watson_text=' + full_message + 
        '&local_text=' + this.state.localText + 
        '&pace=' + this.state.pace + 
        '&browser_name=' + browser.name + 
        '&browser_version=' + browser.version
        , {
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }) 
    }
  }

  render() {
    const messages = this.getFinalAndLatestInterimResult();
    let full_message = "";

    messages.forEach(function(msg) {
      msg.results.forEach(function(result) {
        full_message += result.alternatives[0].transcript;
      })
    })

    if (this.state.stage === 0) {
      return (
        <div className="frontPg">
          <h1 className="white">Welcome to StarSpeak</h1>
          <h2 className="white">Helping students to embrace their presentation.</h2>
          <br/>
          <p>&nbsp;</p>
          <button className="whiteBtn" onClick={this.startStage1.bind(this)}>Start</button>
        </div>
      );
    } else if (this.state.stage === 1) {
      return (
        <div>
          <div className="centerFixed">
            <h2 className="white">Adjust your camera</h2>
            <button className="whiteBtn" onClick={this.startStage2.bind(this)}>Ready</button>
          </div>
        <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.state.width} height={this.state.width * 0.75}/>
        </div>
      );
    } else if (this.state.stage === 2) {
      return (
        <div>
        <div className="centerFixed">
          
          <h1 className="white">{this.state.lesson.name}</h1>

          <br/><br/><br/><br/><br/><br/>

          <h3 className="white">Read the situation below and present your solution to the best of your ability.</h3>
          <br/>
          <h2 className="white">{this.state.lesson.content}</h2>
          <h2 className="white">You have {this.state.lesson.length} seconds to present.</h2>
          <button className="whiteBtn" onClick={this.startStage3.bind(this)}>Continue</button>
        </div>

        <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.state.width} height={this.state.width * 0.75}/>
        </div>
      );
    } else if (this.state.stage === 3) {
      return (
        <div>
        <div className="centerFixed">
          <h2>
            {(this.state.count2 % 2) == 0 ?  
            <FontAwesome
              className='super-crazy-colors'
              name='circle'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',   display: 'none', position: 'fixed', top: '78px', marginLeft: '-25px' }}
            /> :  
            <FontAwesome
              className='super-crazy-colors'
              name='circle'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#e74c3c', fontSize: '20px', position: 'fixed', top: '78px', marginLeft: '-25px' }}
            /> }
            {formatSeconds(this.state.count2)}
            <button className="whiteBtnSpace" onClick={this.startStage4.bind(this)}>Stop</button>
          </h2>
        </div>
          <Webcam audio={false} className="reactWebcam" ref='webcam' width={this.state.width} height={this.state.width * 0.75} ref='webcam'/>

        </div>
      );
    } else if (this.state.stage == 4) {
      return (
        <div className="bgWhite">
          <div className="container">
            <h3 className="finishedLink"><a href={linkBack}>Click here when finished</a></h3>
            <h1>Results</h1>
            <p>{this.state.localText}</p>
            <p>Pace: {Math.round(this.state.pace)} Words per Minute</p>
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
          </div>
        </div>
      );
    } else {
      var linkBack = '/' + this.state.level.id + '/' + this.state.moduler.id + '/lessons';
      return (
        <div className="bgWhite">
          <div className="container">
            <h3 className="finishedLink"><a href={linkBack}>Click here when finished</a></h3>
            <h1>Results</h1>
            <p>{this.state.localText}</p>
            <p>Pace: {Math.round(this.state.pace)} Words per Minute</p>
            <br/>

            <Row>
              <Col md={4}>
                <h2>Personality</h2>
                <p>Agreeableness</p>
                <ProgressBar now={this.state.agreeableness * 100} label={`${Math.round(this.state.agreeableness * 100)}%`} />
                <p>Conscientiousness</p>
                <ProgressBar now={this.state.conscientiousness * 100} label={`${Math.round(this.state.conscientiousness * 100)}%`} />
                <p>Extraversion</p>
                <ProgressBar now={this.state.extraversion * 100} label={`${Math.round(this.state.extraversion * 100)}%`} />
                <p>Openness</p>
                <ProgressBar now={this.state.openness * 100} label={`${Math.round(this.state.openness * 100)}%`} />
              </Col>
              <Col md={4}>
                <h2>Speech Emotions</h2>
                <p>Happy</p>
                <ProgressBar now={this.state.happy2 * 100} label={`${Math.round(this.state.happy2 * 100)}%`} />
                <p>Sad</p>
                <ProgressBar now={this.state.sad2 * 100} label={`${Math.round(this.state.sad2 * 100)}%`} />
                <p>Angry</p>
                <ProgressBar now={this.state.angry2 * 100} label={`${Math.round(this.state.angry2 * 100)}%`} />
                <p>Fear</p>
                <ProgressBar now={this.state.fear2 * 100} label={`${Math.round(this.state.fear2 * 100)}%`} />
                <p>Surprise</p>
                <ProgressBar now={this.state.surprise2 * 100} label={`${Math.round(this.state.surprise2 * 100)}%`} />
              </Col>
              <Col md={4}>
                <h2>Facial Emotions</h2>
                <p>Happy</p>
                <ProgressBar now={this.state.happy * 100} label={`${Math.round(this.state.happy * 100)}%`} />
                <p>Sad</p>
                <ProgressBar now={this.state.sad * 100} label={`${Math.round(this.state.sad * 100)}%`} />
                <p>Angry</p>
                <ProgressBar now={this.state.angry * 100} label={`${Math.round(this.state.angry * 100)}%`} />
                <p>Fear</p>
                <ProgressBar now={this.state.fear * 100} label={`${Math.round(this.state.fear * 100)}%`} />
                <p>Surprise</p>
                <ProgressBar now={this.state.surprise * 100} label={`${Math.round(this.state.surprise * 100)}%`} />
                <p>Neutral</p>
                <ProgressBar now={this.state.neutral * 100} label={`${Math.round(this.state.neutral * 100)}%`} />
              </Col>
            </Row>
          </div>
        </div>
      );
    } 
  }
}

