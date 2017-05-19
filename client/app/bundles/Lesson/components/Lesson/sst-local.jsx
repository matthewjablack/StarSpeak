import React from 'react';

export function handleLocalStream() {
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