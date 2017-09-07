import React from 'react';
// import SpeechToText from 'speech-to-text';
import SpeechFrame from './SpeechFrame';
import SpeechToTextNext from './SpeechToTextNext';

export function handleLocalStream(ctx) {
  const onAnythingSaid = (text, confidence) => {
    if (ctx.state.stage == 'Record') {
      let newLocal = ctx.state.local;
      newLocal.sttInterim = text;
      let speechFrameContainer = ctx.state.speechFrameContainer;
      let speechFrame = new SpeechFrame(text, ctx.state.frame, confidence);
      speechFrameContainer.addSpeech(speechFrame);
      ctx.setState({speechFrameContainer: speechFrameContainer, local: newLocal});
      console.log(`Interim text: ${text}`);
      console.log(`Confidence: ${confidence}`)
    }
  }
  const onFinalised = text => {
    if (ctx.state.stage == 'Record') {
      let newLocal = ctx.state.local;
      newLocal.sttFinal[newLocal.sttFinal.length] = text;
      ctx.setState({local: newLocal});
      console.log(`Finalised text: ${text}`);
    }
  }
  try {
    const listener = new SpeechToTextNext(onAnythingSaid, onFinalised);
    listener.startListening();
  } catch (error) {
    console.log(error);
  }
}
