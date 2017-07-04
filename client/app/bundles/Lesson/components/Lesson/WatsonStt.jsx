import React from 'react';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';

function reset(ctx) {
  if (ctx.state.audioSource) {
    stopTranscription(ctx);
  }
  ctx.setState({rawMessages: [], formattedMessages: [], error: null});
}

function captureSettings(ctx) {
  ctx.setState({
    settingsAtStreamStart: {
      model: ctx.state.model,
      keywords: [],
      speakerLabels: ctx.state.speakerLabels
    }
  });
}

function stopTranscription(ctx) {
  ctx.state.stream && ctx.state.stream.stop();
  ctx.setState({audioSource: null});
}

function getRecognizeOptions(ctx, extra) {
  return Object.assign({
    token: ctx.state.token, smart_formatting: true, 
    format: true, 
    model: ctx.state.model,
    hesitation: 'um',
    objectMode: true,
    interim_results: true,
    continuous: true,
    word_alternatives_threshold: 0.01,
    keywords: [],
    keywords_threshold: 0
      ? 0.01
      : undefined, 
    timestamps: true,
    speaker_labels: ctx.state.speakerLabels,
    resultsBySpeaker: ctx.state.speakerLabels,
    speakerlessInterim: ctx.state.speakerLabels
  }, extra);
}

export function handleMicClick(ctx) {
  if (ctx.state.audioSource === 'mic') {
    return stopTranscription(ctx);
  }
  reset(ctx);
  ctx.setState({audioSource: 'mic'});
  handleStream(recognizeMicrophone(getRecognizeOptions(ctx)), ctx);
}


function handleStream(stream, ctx) {
  if (ctx.state.stream) {
    ctx.state.stream.stop();
    ctx.state.stream.removeAllListeners();
    ctx.state.stream.recognizeStream.removeAllListeners();
  }
  ctx.setState({stream: stream});
  captureSettings(ctx);

  stream.on('data', 
    function(msg) {
      ctx.setState({formattedMessages: ctx.state.formattedMessages.concat(msg)});
    }
    ).on('end', 
    function(msg){
      ctx.setState({rawMessages: ctx.state.rawMessages.concat(msg)});
    }
    ).on('error', handleError.bind(ctx));

  stream.recognizeStream.on('end', () => {
    if (ctx.state.error) {handleTranscriptEnd(ctx)};
  });

  stream.recognizeStream
    .on('message', (frame, json) => handleRawdMessage(ctx,{sent: false, frame, json}))
    .on('send-json', json => handleRawdMessage(ctx,{sent: true, json}))
    .once('send-data', () => handleRawdMessage(ctx,{
      sent: true, binary: true, data: true // discard the binary data to avoid waisting memory
    }))
    .on('close', (code, message) => handleRawdMessage(ctx,{close: true, code, message}));
}



function handleRawdMessage(ctx,msg) {
  ctx.setState({rawMessages: ctx.state.rawMessages.concat(msg)});
}

function handleTranscriptEnd(ctx) {
  ctx.setState({audioSource: null})
}

function getFinalResults(ctx) {
  return ctx.state.formattedMessages.filter(r => r.results && r.results.length && r.results[0].final);
}

function getCurrentInterimResult(ctx) {
  const r = ctx.state.formattedMessages[ctx.state.formattedMessages.length - 1];
  if (!r || !r.results || !r.results.length || r.results[0].final) {
    return null;
  }
  console.log(r);
  return r;
}

export function getFinalAndLatestInterimResult(ctx) {
  const final = getFinalResults(ctx);
  const interim = getCurrentInterimResult(ctx);
  if (interim) {
    final.push(interim);
  }
  return final;
}

function handleError(err, extra) {
  try {
    if (err.name == 'UNRECOGNIZED_FORMAT') {
      err = 'Unable to determine content type from file header; only wav, flac, and ogg/opus are supported. Please choose a different file.';
    } else if (err.name === 'NotSupportedError' && ctx.state.audioSource === 'mic') {
      err = 'This browser does not support microphone input.';
    } else if (err.message === '(\'UpsamplingNotAllowed\', 8000, 16000)') {
      err = 'Please select a narrowband voice model to transcribe 8KHz audio files.';
    }
    ctx.setState({ error: err.message || err });
  } catch(error) {
    console.log(error);
  }
}
