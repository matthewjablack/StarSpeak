import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CollapsibleItem} from '@mblackmblack/react-materialize'
import {isObjectEmpty} from './params';
import {getSortedHash} from './common';

export default class KeywordDensity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      intersectFillerWords: [],
      highDensityWords: []
    }
  }

  componentWillMount() {
    const commonFillerWords = [
      'like', 'so', 'well', 'totally', 'actually', 'basically', 'okay', 
      'seriously', 'something'
    ];

    let wordFrequency = this.props.wordFrequency
    let words = []
    for (let word in wordFrequency) {
      words.push(word);
    }
    let intersectFillerWords = words.filter((n) => commonFillerWords.includes(n));

    let highDensityWords = []; 
    for (let word in wordFrequency) {
      if (wordFrequency[word] > 2) {
        let newHash = {}
        newHash["word"] = word;
        newHash["value"] = wordFrequency[word];
        highDensityWords.push(newHash);
      }
    }

    highDensityWords.sort((a,b) => {
      return b.value - a.value
    })

    this.setState({
      words: words, 
      intersectFillerWords: intersectFillerWords,
      highDensityWords: highDensityWords
    });
  }

  render() {
    const { ...other } = this.props;

    let collapsibleHeader;
    let collapsibleIcon;
    let className;

    if (this.state.intersectFillerWords.length > 0 && this.state.highDensityWords.length > 0) {
      collapsibleHeader = 'Watch out for repeating and filler words';
      collapsibleIcon = 'error';
      className = "red-txt";
    } else if (this.state.intersectFillerWords.length > 0) {
      collapsibleHeader = 'Watch out for filler words';
      collapsibleIcon = 'error';
      className = "red-txt";
    } else if (this.state.highDensityWords.length > 0) {
      collapsibleHeader = 'Watch out for repeating words';
      collapsibleIcon = 'warning';
      className = "yellow-txt";
    } else {
      collapsibleHeader = 'Great job! No filler words or repeating words.';
      collapsibleIcon = 'done';
      className = "green-txt";
    }

    let collapsibleBodyFillerWords;

    if (this.state.intersectFillerWords.length > 1) {
      collapsibleBodyFillerWords = (
        <div>
          <p>We noticed you had some filler words in your speech.</p>
          <p>
            {this.state.intersectFillerWords.map((word, i) => 
              <span key={i}>
                {!!i && ", "}
                {word}
              </span>
            )}
          </p>
          <p>Sometimes this is perfectly okay. Just be sure not to use them too much.</p>
        </div>
      )
    } else if (this.state.intersectFillerWords.length > 0) {
      collapsibleBodyFillerWords = (
        <div>
          <p>We noticed you said a filler word in your speech.</p>
          {this.state.intersectFillerWords[0]}
          <p>Sometimes this is perfectly okay. Just be sure not to use it too much.</p>
        </div>
      )
    }

    let collapsibleHighDensityWords;

    if (this.state.highDensityWords.length > 0) {
      collapsibleHighDensityWords = (
        <div>
          {this.state.intersectFillerWords.length > 0 && <br/>}
          <p>Watch out for repeating words.</p>
          <p>
            {this.state.highDensityWords.map((highDensity, i) => 
              <span key={i}>
                {!!i && ", "}
                {highDensity.word}: {highDensity.value}
              </span>
            )}
          </p>
        </div>
      )
    }

    return (
      <CollapsibleItem className={className} header={collapsibleHeader} icon={collapsibleIcon} {...other}>
        {collapsibleBodyFillerWords}
        {collapsibleHighDensityWords}
      </CollapsibleItem>
    )
  }
}
