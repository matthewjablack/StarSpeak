import React from 'react';
import RecordRTC from 'recordrtc';
const uuidV1 = require('uuid/v1');

var src;
var uploadDetails;

function captureUserMedia(callback) {  
  var params = { audio: true, video: true };
  navigator.getUserMedia(params, callback, (error) => {
    alert(JSON.stringify(error));
  });
};


export function requestUserMedia() {
  captureUserMedia((stream) => {
    src = window.URL.createObjectURL(stream);
  });
}


export function startRecord(ctx) {
  captureUserMedia((stream) => {
    ctx.setState({recordVideo: RecordRTC(stream, { type: 'video' })});
    ctx.state.recordVideo.startRecording();
  });
}

export function stopRecord(ctx, uuid) {
  ctx.state.recordVideo.stopRecording(() => {
    var blob = ctx.state.recordVideo.getBlob();

    var fileName = uuid + '.webm';

    var file = new File([blob], fileName, {
        type: 'video/webm'
    });

    debugger;

    ctx.setState({upload: {name: file.name, size: file.size, loaded: 0} });

    FileStore.createResource(file, ctx, { onProgress: handleProgress })
    .then((data) => {
      handleResourceCreated(file, data.video, ctx);
    })
    .fail((xhr) => {
      handleError(file, xhr, ctx);
    });

    ctx.setState({ uploading: true });
  });
}


function handleProgress(file, loaded, ctx) {
  var upload = ctx.state.upload;
  if (upload) { ctx.state.upload.loaded = loaded };

  let loader = ctx.state.upload.loaded;
  let size = ctx.state.upload.size;

  ctx.setState({
   percentUploaded: Math.round((loader) / (size) * 100)
  });
}

function handleError(file, xhr, ctx) {
  ctx.setState({ errors: file.name + ' failed to upload'});
}

function handleResourceCreated(file, video, ctx) {
  ctx.setState({video: video});
}