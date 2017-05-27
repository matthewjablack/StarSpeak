import React from 'react';


// fetching DOM references

var videoElement      = document.querySelector('video');

var progressBar = document.querySelector('#progress-bar');
var percentage = document.querySelector('#percentage');

var recorder;

// reusable helpers

// this function submits recorded blob to nodejs server
function postFiles() {
    var blob = recorder.getBlob();

    // getting unique identifier for the file name
    var fileName = generateRandomString() + '.webm';

    var file = new File([blob], fileName, {
        type: 'video/webm'
    });

    videoElement.src = '';
    videoElement.poster = '/ajax-loader.gif';

    xhr('/uploadFile', file, function(responseText) {
        var fileURL = JSON.parse(responseText).fileURL;

        console.info('fileURL', fileURL);
        videoElement.src = fileURL;
        videoElement.play();
        videoElement.muted = false;
        videoElement.controls = true;

        document.querySelector('#footer-h2').innerHTML = '<a href="' + videoElement.src + '">' + videoElement.src + '</a>';
    });

    if(mediaStream) mediaStream.stop();
}

// XHR2/FormData
function xhr(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };

    request.upload.onprogress = function(event) {
        progressBar.max = event.total;
        progressBar.value = event.loaded;
        progressBar.innerHTML = 'Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%";
    };

    request.upload.onload = function() {
        percentage.style.display = 'none';
        progressBar.style.display = 'none';
    };
    request.open('POST', url);

    var formData = new FormData();
    formData.append('file', data);
    request.send(formData);
}

// generating random string
function generateRandomString() {
    if (window.crypto) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
            token = '';
        for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
    }
}

var mediaStream = null;
// reusable getUserMedia
function captureUserMedia(success_callback) {
    var session = {
        audio: true,
        video: true
    };

    navigator.getUserMedia(session, success_callback, function(error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}