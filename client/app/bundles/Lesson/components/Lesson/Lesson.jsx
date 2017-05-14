import PropTypes from 'prop-types';
import React from 'react';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import s from './Lesson.css';
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


var Timers = require("react-timers");


var k = [
  "016fe87430f6925ba984a78f83b93fe1",
];

var etype = ['Happy', 'Sad', 'Angry', 'Fear', 'Surprise'];

var screenshots = [];

var screenCount = 0;


const ERR_MIC_NARROWBAND = 'Microphone transcription cannot accommodate narrowband voice models, please select a broadband one.';

class Lesson extends React.Component{
  static propTypes = {
    title: PropTypes.string.isRequired,
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
      // transcript model and keywords are the state that they were when the button was clicked.
      // Changing them during a transcription would cause a mismatch between the setting sent to the service and what is displayed on the demo, and could cause bugs.
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
    };

    // this.startStage1.bind(this);
    this.handleFormattedMessage = this.handleFormattedMessage.bind(this);
    this.handleRawdMessage = this.handleRawdMessage.bind(this);
    this.handleTranscriptEnd = this.handleTranscriptEnd.bind(this);
    this.handleMicClick = this.handleMicClick.bind(this);
    this.stopTranscription = this.stopTranscription.bind(this);
    this.fetchToken = this.fetchToken.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }


  componentDidMount() {
    this.fetchToken();

    if (!this.isObjectEmpty(this.paramsObject())) {
      this.setState({stage: 1})
      this.fetchLesson(this.paramsObject().auth_token, this.paramsObject().lesson_id);
    }

    
    // tokens expire after 60 minutes, so automatcally fetch a new one ever 50 minutes
    // Not sure if this will work properly if a computer goes to sleep for > 50 minutes and then wakes back up
    // react automatically binds the call to this
    this.setState({'tokenInterval' : setInterval(this.fetchToken, 50 * 60 * 1000) });

    // console.log('demo');

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));

    
    setInterval(() => {
      // if (this.state.stage == 1 && this.state.count1 > 0) {
      //   this.setState({ count1: this.state.count1 - 1 });
      //   // console.log(this.state.lastUpdated);
      // } else if (this.state.stage == 1 && this.state.count1 == 0) {
      //   this.setState({stage: 2});
      // }
      if (this.state.stage == 3 && this.state.count2 > 0) {
        this.setState({ count2: this.state.count2 - 1 });
        // console.log(this.state.lastUpdated);
      } else if (this.state.stage == 3 && this.state.count2 == 0) {
        this.setState({stage: 4});
        this.handleMicClick();
      }
      if (this.state.stage == 3 && this.state.count3 > 0) {
        this.setState({ count3: this.state.count3 - 1 });
        // console.log(this.state.lastUpdated);
      } else if (this.state.stage == 3 && this.state.count3 == 0) {
        this.setState({txtSpeak: false});
      }
      if (this.state.stage == 4 && this.state.readability == null) {
        this.setState({readability: false});

        const messages = this.getFinalAndLatestInterimResult();
        // console.log(messages);

        let full_message = "";

        messages.forEach(function(msg) {
          msg.results.forEach(function(result) {
            full_message += result.alternatives[0].transcript;
          })
        })
        // console.log(full_message);


        // this.getReadability(full_message);

      }

      if (this.state.count2 % 2 == 0 && this.state.stage == 3) {
        let screenshot = this.refs.webcam.getScreenshot();
        screenshots[screenCount] = screenshot;
        // this.storeEmotion(screenshot);
        // this.analyzeEmotion(screenshot);
        screenCount += 1;
      }

      if (this.state.analyzing == false && this.state.stage == 4) {
        // console.log("it's starting");

        const messages = this.getFinalAndLatestInterimResult();
        // console.log(messages);

        let full_message = "";

        messages.forEach(function(msg) {
          msg.results.forEach(function(result) {
            full_message += result.alternatives[0].transcript;
          })
        })

        this.startAnalyzing(full_message);
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

  /**
     * The behavior of several of the views depends on the settings when the transcription was started
     * So, this stores those values in a settingsAtStreamStart object.
     */
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

  isNarrowBand(model) {
    model = model || this.state.model;
    return model.indexOf('Narrowband') !== -1;
  }

  handleMicClick() {
    if (this.state.audioSource === 'mic') {
      return this.stopTranscription();
    }
    this.reset();
    this.setState({audioSource: 'mic'});

    // The recognizeMicrophone() method is a helper method provided by the watson-speach package
    // It sets up the microphone, converts and downsamples the audio, and then transcribes it over a WebSocket connection
    // It also provides a number of optional features, some of which are enabled by default:
    //  * enables object mode by default (options.objectMode)
    //  * formats results (Capitals, periods, etc.) (options.format)
    //  * outputs the text to a DOM element - not used in this demo because it doesn't play nice with react (options.outputElement)
    //  * a few other things for backwards compatibility and sane defaults
    // In addition to this, it passes other service-level options along to the RecognizeStream that manages the actual WebSocket connection.
    this.handleStream(recognizeMicrophone(this.getRecognizeOptions()));
  }

  handleUploadClick() {
    if (this.state.audioSource === 'upload') {
      this.stopTranscription();
    } else {
      this.dropzone.open();
    }
  }

  handleUserFile(files) {
    const file = files[0];
    if (!file) {
      return;
    }
    this.reset();
    this.setState({audioSource: 'upload'});
    this.playFile(file);
  }

  handleUserFileRejection() {
    this.setState({error: 'Sorry, that file does not appear to be compatible.'});
  }
  handleSample1Click() {
    this.handleSampleClick(1);
  }
  handleSample2Click() {
    this.handleSampleClick(2);
  }

  handleSampleClick(which) {
    if (this.state.audioSource === 'sample-' + which) {
      return this.stopTranscription();
    }
    let filename = samples[this.state.model] && samples[this.state.model][which - 1].filename;
    if (!filename) {
      return this.handleError(`No sample ${which} available for model ${this.state.model}`, samples[this.state.model]);
    }
    this.reset();
    this.setState({
      audioSource: 'sample-' + which
    });
    this.playFile('audio/' + filename);
  }

  /**
     * @param {File|Blob|String} file - url to an audio file or a File instance fro user-provided files
     */
  playFile(file) {
    // The recognizeFile() method is a helper method provided by the watson-speach package
    // It accepts a file input and transcribes the contents over a WebSocket connection
    // It also provides a number of optional features, some of which are enabled by default:
    //  * enables object mode by default (options.objectMode)
    //  * plays the file in the browser if possible (options.play)
    //  * formats results (Capitals, periods, etc.) (options.format)
    //  * slows results down to realtime speed if received faster than realtime - this causes extra interim `data` events to be emitted (options.realtime)
    //  * combines speaker_labels with results (options.resultsBySpeaker)
    //  * outputs the text to a DOM element - not used in this demo because it doesn't play nice with react (options.outputElement)
    //  * a few other things for backwards compatibility and sane defaults
    // In addition to this, it passes other service-level options along to the RecognizeStream that manages the actual WebSocket connection.
    this.handleStream(recognizeFile(this.getRecognizeOptions({
      file: file, play: true, // play the audio out loud
      realtime: true, // use a helper stream to slow down the transcript output to match the audio speed
    })));
  }

  handleStream(stream) {
    // cleanup old stream if appropriate
    if (this.stream) {
      this.stream.stop();
      this.stream.removeAllListeners();
      this.stream.recognizeStream.removeAllListeners();
    }
    this.stream = stream;
    this.captureSettings();

    // grab the formatted messages and also handle errors and such
    stream.on('data', this.handleFormattedMessage).on('end', this.handleTranscriptEnd).on('error', this.handleError);

    // when errors occur, the end event may not propagate through the helper streams.
    // However, the recognizeStream should always fire a end and close events
    stream.recognizeStream.on('end', () => {
      if (this.state.error) {
        this.handleTranscriptEnd();
      }
    });

    // grab raw messages from the debugging events for display on the JSON tab
    stream.recognizeStream
      .on('message', (frame, json) => this.handleRawdMessage({sent: false, frame, json}))
      .on('send-json', json => this.handleRawdMessage({sent: true, json}))
      .once('send-data', () => this.handleRawdMessage({
        sent: true, binary: true, data: true // discard the binary data to avoid waisting memory
      }))
      .on('close', (code, message) => this.handleRawdMessage({close: true, code, message}));

    // ['open','close','finish','end','error', 'pipe'].forEach(e => {
    //     stream.recognizeStream.on(e, console.log.bind(console, 'rs event: ', e));
    //     stream.on(e, console.log.bind(console, 'stream event: ', e));
    // });
  }

  handleRawdMessage(msg) {
    console.log(msg);
    // let me = this;
    this.setState({rawMessages: this.state.rawMessages.concat(msg)});
  }

  handleFormattedMessage(msg) {
    console.log(msg);
    // let me = this;
    this.setState({formattedMessages: this.state.formattedMessages.concat(msg)});
  }

  handleTranscriptEnd() {
    // note: this function will be called twice on a clean end,
    // but may only be called once in the event of an error
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

    console.log('lesson name');
    console.log(responseJson.lesson.name);

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

    // this.setState({
    //   lesson_name: 
    // })

    console.log('almost there');

    console.log(responseJson);

    console.log(this.props.query);
    console.log(this.query);
    console.log(this.route);
    console.log(window.location);
    console.log(this.paramsObject())
    console.log(this.props.location);

  }

  paramsObject() {
    var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

    for ( i in pairs ) {
      if ( pairs[i] === "" ) continue;

      pair = pairs[i].split("=");
      obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
    }

    return obj;
  }

  isObjectEmpty(object) {
    if ('object' !== typeof object) {
        throw new Error('Object must be specified.');
    }

    if (null === object) {
        return true;
    }

    if ('undefined' !== Object.keys) {
        // Using ECMAScript 5 feature.
        return (0 === Object.keys(object).length);
    } else {
        // Using legacy compatibility mode.
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
  } 


  fetchToken() {
    return fetch('/api/token').then(res => {
      if (res.status != 200) {
        throw new Error('Error retrieving auth token');
      }
      return res.text();
    }). // todo: throw here if non-200 status
    then(token => this.setState({token})).catch(this.handleError);
  }

  getKeywords(model) {
    // a few models have more than two sample files, but the demo can only handle two samples at the moment
    // so this just takes the keywords from the first two samples
    const files = samples[model];
    return files && files.length >= 2 && files[0].keywords + ', ' + files[1].keywords || '';
  }

  handleModelChange(model) {
    this.setState({model, keywords: this.getKeywords(model), speakerLabels: this.supportsSpeakerLabels(model)});

    // clear the microphone narrowband error if it's visible and a broadband model was just selected
    if (this.state.error === ERR_MIC_NARROWBAND && !this.isNarrowBand(model)) {
      this.setState({error: null});
    }

    // clear the speaker_lables is not supported error - e.g.
    // speaker_labels is not a supported feature for model en-US_BroadbandModel
    if (this.state.error && this.state.error.indexOf('speaker_labels is not a supported feature for model') === 0) {
      this.setState({error: null});
    }
  }

  supportsSpeakerLabels(model) {
    model = model || this.state.model;
    // todo: read the upd-to-date models list instead of the cached one
    return cachedModels.some(m => m.name === model && m.supported_features.speaker_labels);
  }

  handleSpeakerLabelsChange() {
    this.setState({
      speakerLabels: !this.state.speakerLabels
    });
  }

  handleKeywordsChange(e) {
    this.setState({keywords: e.target.value});
  }

  // cleans up the keywords string into an array of individual, trimmed, non-empty keywords/phrases
  getKeywordsArr() {
    return this.state.keywords.split(',').map(k => k.trim()).filter(k => k);
  }

  getFinalResults() {
    return this.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final);
  }

  getCurrentInterimResult() {
    const r = this.state.formattedMessages[this.state.formattedMessages.length - 1];

    // When resultsBySpeaker is enabled, each msg.results array may contain multiple results. However, all results
    // in a given message will be either final or interim, so just checking the first one still works here.
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

  

  formatSeconds(seconds) {
    let hours = Math.floor(seconds/3600);
    let remh = seconds % 3600;
    let minutes = Math.floor(remh/60);
    let seconds2 = remh % 60;
    return this.formatDigit(hours) + ":" + this.formatDigit(minutes) + ":" + this.formatDigit(seconds2);
  }

  formatDigit(number) {
    if(number < 10) {
      return "0" + number.toString();
    } else {
      return number.toString();
    }
  }

  startStage1() {
    this.setState({stage: 1});
  }

  startStage2() {
    // console.log('stage 2');
    this.setState({stage: 2});
  }

  startStage3() {
    // console.log('stage 3');
    this.setState({stage: 3});
    this.handleMicClick();
  }

  startStage4() {
    // console.log('stage 3');
    this.setState({stage: 4, length: this.state.length - this.state.count2});
    this.handleMicClick();
  }


  storeEmotion(screenshot) {
    var screenshots = this.state.screenshot;
    screenshots[this.state.screenCount] = screenshot;
    this.setState({screenshot: screenshots, screenCount: this.state.screenCount + 1})
  }

  async startAnalyzing(txt) {
    this.setState({analyzing: true});
    // console.log(screenCount);
    // console.log('hello');
    // console.log(k[Math.floor(Math.random()*k.length)])
    for (var i = 0; i < screenCount; i++) {
      // console.log('first');
      // console.log(screenshots[i]);
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
        'https://starspeak.io/api/v1/speechstats.json?auth_token=' + this.state.auth_token +
        '&user_id=' + this.state.user_id +
        '&betacode_id=' + this.state.betacode_id + 
        '&lesson_id=' + this.state.lesson_id + 
        '&moduler_id=' + this.state.moduler_id + 
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
        '&watson_text=' + full_message
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

    const buttonsEnabled = !!this.state.token;
    const buttonClass = buttonsEnabled
      ? 'base--button'
      : 'base--button base--button_black';

    let micIconFill = '#000000';
    let micButtonClass = buttonClass;
    if (this.state.audioSource === 'mic') {
      micButtonClass += ' mic-active';
      micIconFill = '#FFFFFF';
    } else if (!recognizeMicrophone.isSupported) {
      micButtonClass += ' base--button_black';
    }

    const err = this.state.error
      ? (
        <Alert type="error" color="red">
          <p className="base--p">{this.state.error}</p>
        </Alert>
      )
      : null;

    const messages = this.getFinalAndLatestInterimResult();

    // console.log(messages);

    let full_message = "";

    messages.forEach(function(msg) {
      msg.results.forEach(function(result) {
        full_message += result.alternatives[0].transcript;
      })
    })
    // console.log(full_message);

    const micBullet = (typeof window !== "undefined" && recognizeMicrophone.isSupported) ?
        <li className="base--li">Use your microphone to record audio.</li> :
        <li className="base--li base--p_light">Use your microphone to record audio. (Not supported in current browser)</li>;

    if (this.state.stage === 0) {
      return (
        <div className={s.frontPg}>
          <h1 className={s.white}>Welcome to StarSpeak</h1>
          <h2 className={s.white}>Helping students to embrace their presentation.</h2>
          <br/>
          <p>&nbsp;</p>
          <button className={s.whiteBtn} onClick={this.startStage1.bind(this)}>Start</button>
        </div>
      );
    } else if (this.state.stage === 2) {
      return (
        <div>
        <div className={s.centerFixed}>
          
          <h1 className={s.white}>{this.state.lesson_name}</h1>

          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>

          <h3 className={s.white}>Read the situation below and present your solution to the best of your ability.</h3>
          <br/>
          <h2 className={s.white}>{this.state.content}</h2>
          <h2 className={s.white}>You have {this.state.length} seconds to present.</h2>


          <button className={s.whiteBtn} onClick={this.startStage3.bind(this)}>Continue</button>

          
        </div>

        <Webcam audio={false} className={s.reactWebcam} ref='webcam' width={this.state.width} height={this.state.width * 0.75}/>
        </div>
      );
    } else if (this.state.stage === 1) {
      return (
        <div>
          <div className={s.centerFixed}>
            <h2 className={s.white}>Adjust your camera</h2>
            <button className={s.whiteBtn} onClick={this.startStage2.bind(this)}>Ready</button>
          </div>
        <Webcam audio={false} className={s.reactWebcam} ref='webcam' width={this.state.width} height={this.state.width * 0.75}/>
        </div>
      );
    } else if (this.state.stage === 3) {

      console.log(this.state.rawMessages);
      console.log(this.state.formattedMessages);
      

      return (
        <div>
        <div className={s.centerFixed}>

          <h2>
            {(this.state.count2 % 2) == 0 ?  
            <FontAwesome
              className='super-crazy-colors'
              name='circle'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',   display: 'none', position: 'fixed', top: '110px', marginLeft: '-25px' }}
            /> :  
            <FontAwesome
              className='super-crazy-colors'
              name='circle'
              style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', color: '#e74c3c', fontSize: '20px', position: 'fixed', top: '110px', marginLeft: '-25px' }}
            /> }
            {this.formatSeconds(this.state.count2)}
            <button className={s.whiteBtnSpace} onClick={this.startStage4.bind(this)}>Stop</button>
          </h2>

        </div>


          <Webcam audio={false} className={s.reactWebcam} ref='webcam' width={this.state.width} height={this.state.width * 0.75} ref='webcam'/>



          <div className="flex buttons">

            <button className={micButtonClass} onClick={this.handleMicClick}>
              <Icon type={this.state.audioSource === 'mic' ? 'stop' : 'microphone'} fill={micIconFill} /> Record Audio
            </button>

            <button className={buttonClass} onClick={this.handleUploadClick}>
              <Icon type={this.state.audioSource === 'upload' ? 'stop' : 'upload'} /> Upload Audio File
            </button>

            <button className={buttonClass} onClick={this.handleSample1Click}>
              <Icon type={this.state.audioSource === 'sample-1' ? 'stop' : 'play'} /> Play Sample 1
            </button>

            <button className={buttonClass} onClick={this.handleSample2Click}>
              <Icon type={this.state.audioSource === 'sample-2' ? 'stop' : 'play'} /> Play Sample 2
            </button>

          </div>

          {err}

          <Tabs selected={0}>
            <Pane label="Text">
              {this.state.settingsAtStreamStart.speakerLabels
                ? <SpeakersView messages={messages}/>
                : <Transcript messages={messages}/>}
            </Pane>
            <Pane label="Word Timings and Alternatives">
              <TimingView messages={messages}/>
            </Pane>
            <Pane label={'Keywords ' + getKeywordsSummary(this.state.settingsAtStreamStart.keywords, messages)}>
              <Keywords messages={messages} keywords={this.state.settingsAtStreamStart.keywords} isInProgress={!!this.state.audioSource}/>
            </Pane>
            <Pane label="JSON">
              <JSONView raw={this.state.rawMessages} formatted={this.state.formattedMessages}/>
            </Pane>
          </Tabs>

        </div>
      );
    } else if (this.state.stage == 4) {
      return (
        <div className={s.bgWhite}>
          <div className={s.container}>
            <h3 className={s.finishedLink}><a href={linkBack}>Click here when finished</a></h3>
            <h1>Results</h1>
            <Transcript messages={messages}/>
            <p>Confidence</p>
            <ProgressBar now={this.state.confidence * 100} label={`${Math.round(this.state.confidence * 100)}%`} />
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
      var linkBack = 'https://starspeak.io/' + this.state.level_id + '/' + this.state.moduler_id + '/lessons';
      return (
        <div className={s.bgWhite}>
          <div className={s.container}>
            <h3 className={s.finishedLink}><a href={linkBack}>Click here when finished</a></h3>
            <h1>Results</h1>
            <Transcript messages={messages}/>
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


export default withStyles(s)(Lesson);

