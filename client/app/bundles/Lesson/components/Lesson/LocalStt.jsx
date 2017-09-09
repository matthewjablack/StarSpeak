import React from 'react';
import SpeechToText from 'speech-to-text';

export function handleLocalStream(ctx) {
  const onAnythingSaid = text => {
    if (ctx.state.stage == 'Record') {
      let newLocal = ctx.state.local;
      newLocal.sttInterim = text;
      ctx.setState({local: newLocal});
      console.log(`Interim text: ${text}`);
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
    const listener = new SpeechToText(onAnythingSaid, onFinalised);
    listener.startListening();
  } catch (error) {
    console.log(error);
  }
}
