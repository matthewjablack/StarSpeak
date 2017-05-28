import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class FileInput extends Component{
  static propTypes = {
    onCreateVideo: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      errors: null,
      percentLoaded: null,
      uploads: [],
    }
    this.handleUploadFiles = this.handleUploadFiles.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleResourceCreated = this.handleResourceCreated.bind(this);
  }

  handleUploadFiles(e) {
    let uploads = [];
    for (var i = 0; i < e.target.files.length; i++) {
      uploads.push({name: e.target.files[i].name, size: e.target.files[i].size, loaded: 0})
    }
    
    var _this = this;

    this.setState({uploads: uploads});

    for (var i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      FileStore.createResource(file, { onProgress: _this.handleProgress })
      .then(function(data) {
        _this.handleResourceCreated(file, data.video);
      })
      .fail(function(xhr) {
        _this.handleError(file, xhr);
      });
    }
  }

  handleProgress(file, loaded) {
    var upload = this.state.uploads.find(function(value, index) {
      return value.name === file.name;
    })
    if (upload) { upload.loaded = loaded };

    console.log('handle progress');

    let loader = 0;
    let size = 0;
    for (var i = 0; i < this.state.uploads.length; i++) {
      console.log(this.state.uploads[i]);
      console.log(this.state.uploads[i].loaded);
      console.log(this.state.uploads[i].size);
      loader += this.state.uploads[i].loaded;
      size += this.state.uploads[i].size;
      console.log(loader);
    }

    console.log(this.state.uploads);
    console.log(loader);
    console.log(size);

    this.setState({
      percentLoaded: Math.round((loader) / (size) * 100) + '%'
    });
  }

  handleError(file, xhr) {
    console.log(file);
    console.log(xhr);
    this.setState({ errors: file.name + ' failed to upload' });
  }

  handleResourceCreated(file, video) {
    this.state.uploads.splice(this.state.uploads.indexOf(file.name), 1);
    if (!this.state.uploads.length) {
      this.setState({
        percentLoaded: null
      });
    }

    this.props.onCreateVideo(video);
  }

  render() {
    var _this = this;
    return (
      <div>
        <input ref="fileElement" type="file" multiple={true} onChange={this.handleUploadFiles} />
        <span>{this.state.percentLoaded}</span>
        <span>{this.state.errors}</span>
      </div>
    )
  }
}
