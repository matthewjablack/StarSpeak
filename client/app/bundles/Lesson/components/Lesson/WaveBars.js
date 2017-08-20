import React from 'react';

export function waveBars() {
  var canvas = $('.visualizer')[0];
  var canvasCtx = canvas.getContext("2d");

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;
  var distortion = audioCtx.createWaveShaper();
  var gainNode = audioCtx.createGain();
  var biquadFilter = audioCtx.createBiquadFilter();
  var convolver = audioCtx.createConvolver();

  if (navigator.getUserMedia) {
     console.log('getUserMedia supported.');
     navigator.getUserMedia (
        // constraints - only audio needed for this app
        {
           audio: true
        },

        // Success callback
        function(stream) {
           var source = audioCtx.createMediaStreamSource(stream);
           source.connect(analyser);
           analyser.connect(distortion);
           distortion.connect(biquadFilter);
           biquadFilter.connect(convolver);
           convolver.connect(gainNode);
           gainNode.connect(audioCtx.destination);

           visualize(canvas, canvasCtx, analyser);
           voiceChange(distortion, biquadFilter, convolver);

        },

        // Error callback
        function(err) {
           console.log('The following gUM error occured: ' + err);
        }
     );
  } else {
     console.log('getUserMedia not supported on your browser!');
  }
}


function visualize(canvas, canvasCtx, analyser) {
  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  var dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  var draw = function() {
    var drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];

      canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
      canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

      x += barWidth + 1;
    }
  };

  draw();
}

function voiceChange(distortion, biquadFilter, convolver) {
  distortion.oversample = '4x';
  biquadFilter.gain.value = 0;
  convolver.buffer = undefined;
}