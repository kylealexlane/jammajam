/* @flow */

import type { Track, EncodedTrack } from "./types";

import Tone from "tone";

import React, { Component } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FABButton,
  Icon,
  Switch,
} from "react-mdl";

import { VolumeUp, Info } from '@material-ui/icons';

import { CaretRightOutlined } from '@ant-design/icons';

import { Button, Card, Progress, Slider, Collapse, message } from 'antd';

import { PieChart } from 'react-minimal-pie-chart';

const { Panel } = Collapse;

import "./App.css";
import "react-mdl/extra/css/material.light_blue-pink.min.css";
import "react-mdl/extra/material.js";

import * as sequencer from "./sequencer";
import * as model from "./model";
import samples from "./samples.json";

import Population from "./jammajam_ga/population"
import DNA from "./jammajam_ga/dna"
import {
  GENREMAPPINGS
} from "./fitness_mappings"


const notImplementedMessage = () => {
  message.info('This feature is in progress... check back soon!');
};

class SampleSelector extends Component {
  state: {
    open: boolean,
  };

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  open = (event) => {
    event.preventDefault();
    this.setState({open: true});
  };

  close = () => {
    this.setState({open: false});
  };

  onChange = (event) => {
    const {id, onChange} = this.props;
    onChange(id, event.target.value);
    this.close();
  };

  render() {
    const {current} = this.props;
    const {open} = this.state;
    if (open) {
      return (
        <select autoFocus value={current} onChange={this.onChange} onBlur={this.close}>{
          samples.map((sample, i) => {
            return <option key={i}>{sample}</option>;
          })
        }</select>
      );
    } else {
      return <a href="" onClick={this.open}>{current}</a>;
    }
  }
}

function GenreOption({genreFitnessMapping, updateGenreSlider, tracksFitness}) {
  return (
    <div className={"genre-card-container"}>
      <Card title={<div onClick={notImplementedMessage}><a><VolumeUp className="genre-playback-icon"/></a>{genreFitnessMapping.name}</div>} extra={<div onClick={notImplementedMessage}><a><Info /></a></div>}
            style={{ width: 300, borderColor: genreFitnessMapping.weighting > 0 ? genreFitnessMapping.color : '#f0f0f0', borderWidth: 1 }}
      >
        <div className={"genre-card-content"}>
          <div className="genre-card-similarity-container">
            <Progress
              className={"genre-card-similarity-circle"}
              width={80}
              type="circle"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              percent={tracksFitness}
            />
            <p>Similarity to Current Beat</p>
          </div>
          <div className={"genre-card-slider-container"}>
            <Slider
              min={0} max={1}
              step={.05}
              value={genreFitnessMapping.weighting}
              onChange={value => updateGenreSlider(genreFitnessMapping.indices, parseFloat(value))}

            />
            <div className={"genre-card-slider-annotation"}>
              <p>Neutral</p>
              <p>Add More</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function IteratePercentChart({formattedTracksDetails}) {
  let allWeightingsZero = true;

  formattedTracksDetails.forEach(detail => {
    if(detail.value > 0) {
      allWeightingsZero = false;
    }
  });

  return (
    <div className={'iterate-percent-chart-container'}>
      {allWeightingsZero?
        <div className={"noweightings-selected"}><p>There are no beats for the algorithms to work towards.</p><p><b>Please select some updates!</b></p></div>
        :
        <div className={'iterate-percent-chart-container'}>
          <p>The algorithm will be weighted by the following beats:</p>
          {/*<div style={{ fontSize: 7 }}>*/}
            <PieChart
                data={formattedTracksDetails}
                lineWidth={20}
                rounded={true}
                label={(details) => {
                  return details.dataEntry.percentage > 0 ? `${Math.round(details.dataEntry.percentage)}%` : ''
                }}
                animate={false}
                labelPosition={60}
                style={{ fontSize: 10, height: 200, width: 200 }}
              />
          </div>
          }

    </div>
  );
}

function TrackListView({
  tracks,
  currentBeat,
  toggleTrackBeat,
  setTrackVolume,
  updateTrackSample,
  muteTrack,
  clearTrack,
  deleteTrack,
}) {
  return (
    <tbody>{
      tracks.map((track, i) => {
        return (
          <tr key={i} className="track">
            <th>
              <SampleSelector id={track.id} current={track.name} onChange={updateTrackSample} />
            </th>
            <td className="vol">
              <Slider min={0} max={1} step={.1} value={track.vol}
                onChange={value => setTrackVolume(track.id, parseFloat(value))} />
            </td>
            <td className="mute">
              <Switch defaultChecked={!track.muted} onChange={event => muteTrack(track.id)} />
            </td>
            {
              track.beats.map((v, beat) => {
                const beatClass = v ? "active" : beat === currentBeat ? "current" : "";
                return (
                  <td key={beat} className={`beat ${beatClass}`}>
                    <a href="" onClick={(event) => {
                      event.preventDefault();
                      toggleTrackBeat(track.id, beat);
                    }} />
                  </td>
                );
              })
            }
            <td>
              {track.beats.some(v => v) ?
                <a href="" title="Clear track" onClick={event => {
                  event.preventDefault();
                  clearTrack(track.id);
                }}><Icon name="delete"/></a> :
                <Icon className="disabled-icon" name="delete"/>}
              <a href="" title="Delete track" onClick={event => {
                event.preventDefault();
                deleteTrack(track.id);
              }}><Icon name="delete_forever"/></a>
            </td>
          </tr>
        );
      })
    }</tbody>
  );
}

function Controls({bpm, updateBPM, playing, start, stop, addTrack, share}) {
  const onChange = value => updateBPM(parseInt(value, 10));
  return (
    <tfoot className="controls">
      <tr>
        <td style={{textAlign: "right"}}>
          <FABButton mini colored onClick={addTrack} title="Add new track">
            <Icon name="add" />
          </FABButton>
        </td>
        <td />
        <td>
          <FABButton mini colored onClick={playing ? stop : start}>
            <Icon name={playing ? "stop" : "play_arrow"} />
          </FABButton>
        </td>
        <td colSpan="2" className="bpm">
          BPM <input type="number" value={bpm} onChange={onChange} />
        </td>
        <td colSpan="13">
          <Slider min={30} max={240} value={bpm} onChange={onChange} />
        </td>
        <td colSpan="2">
          <FABButton mini onClick={share} title="Share">
            <Icon name="share" />
          </FABButton>
        </td>
      </tr>
    </tfoot>
  );
}

function ShareDialog({hash, closeDialog}) {
  return (
    <Dialog open>
      <DialogTitle>Share</DialogTitle>
      <DialogContent>
        <p>Send this link to your friends so they can enjoy your piece:</p>
        <p className="share-link" style={{textAlign: "center"}}>
          <a className="mdl-button mdl-js-button mdl-button--colored"
            href={"#" + hash} onClick={event => event.preventDefault()}>Link</a>
        </p>
        <p>Right-click, <em>Copy link address</em> to copy the link.</p>
      </DialogContent>
      <DialogActions>
        <Button type="primary" onClick={closeDialog}>close</Button>
      </DialogActions>
    </Dialog>
  );
}

class App extends Component {
  loop: Tone.Sequence;

  state: {
    bpm: number,
    tracksDNA: ?DNA,
    numIterations: number,
    currentBeat: number,
    playing: boolean,
    tracks: Track[],
    genreMappings: [],
    shareHash: ?string,
    hasLoopBeenCreated: boolean,
  };

  constructor(props: {}) {
    super(props);
    const hash = location.hash.substr(1);
    if (hash.length > 0) {
      try {
        const {bpm, tracks}: {
          bpm: number,
          tracks: EncodedTrack[],
        } = JSON.parse(atob(hash));
        this.initializeState({
          bpm,
          tracks: model.decodeTracks(tracks),
        });
      } catch(e) {
        console.warn("Unable to parse hash", hash, e);
        this.initializeState({tracks: model.initTracks()});
      } finally {
        location.hash = "";
      }
    } else {
      this.initializeState({tracks: model.initTracks()});
    }
  }

  initializeState(state: {bpm?: number, tracks: Track[]}) {
    this.state = {
      bpm: 110,
      playing: false,
      currentBeat: -1,
      shareHash: null,
      tracksDNA: null,
      numIterations: 10,
      genreMappings: GENREMAPPINGS,
      hasLoopBeenCreated: false,
      ...state,
    };
    this.loop = sequencer.create(state.tracks, this.updateCurrentBeat);
    this.state.tracksDNA = new DNA(0, 0, 0, this.getTrackBeats(state.tracks));
    sequencer.updateBPM(this.state.bpm);
  }

  start = () => {
    if(!this.state.hasLoopBeenCreated) {
      this.loop = sequencer.startLoop(this.loop)
    }

    this.setState({playing: true});
    this.loop.start();
  };

  stop = () => {
    this.loop.stop();
    this.setState({currentBeat: -1, playing: false});
  };

  updateCurrentBeat = (beat: number): void => {
    this.setState({currentBeat: beat});
  };

  updateTracks = (newTracks: Track[]) => {
    this.loop = sequencer.update(this.loop, newTracks, this.updateCurrentBeat);

    this.setState({
      tracks: newTracks,
      tracksDNA: new DNA(0, 0, 0, this.getTrackBeats(newTracks)),
    });
  };

  addTrack = () => {
    const {tracks} = this.state;
    this.updateTracks(model.addTrack(tracks));
  };

  clearTrack = (id: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.clearTrack(tracks, id));
  };

  deleteTrack = (id: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.deleteTracks(tracks, id));
  };

  toggleTrackBeat = (id: number, beat: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.toggleTrackBeat(tracks, id, beat));
  };

  setTrackVolume = (id: number, vol: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.setTrackVolume(tracks, id, vol));
  };

  muteTrack = (id: number) => {
    const {tracks} = this.state;
    this.updateTracks(model.muteTrack(tracks, id));
  };

  updateBPM = (newBpm: number) => {
    sequencer.updateBPM(newBpm);
    this.setState({bpm: newBpm});
  };

  updateTrackSample = (id: number, sample: string) => {
    const {tracks} = this.state;
    this.updateTracks(model.updateTrackSample(tracks, id, sample));
  };

  closeDialog = () => {
    this.setState({shareHash: null});
  };

  randomSong = () => {
    const {bpm, tracks} = model.randomSong();
    this.updateTracks(tracks);
    this.updateBPM(bpm);
  };

  updateNumIterations = numIterations => {
    this.setState({ numIterations })
  };

  share = () => {
    const {bpm, tracks} = this.state;
    const shareHash = btoa(JSON.stringify({
      bpm,
      tracks: model.encodeTracks(tracks),
    }));
    this.setState({shareHash});
  };

  updateGenreSlider = (indices, newWeighting) => {
    let newGenreMappings = this.state.genreMappings;
    newGenreMappings[indices[0]].track_mappings[indices[1]].weighting = newWeighting;

    this.setState({
      ...this.state,
      genreMappings: newGenreMappings,
    })
  };

  getTrackMapping = (genreMapping, only_mapping_rating) => {
    let idealMappings = genreMapping.mappingFunc(this.state.tracks);
    idealMappings = idealMappings.map(mapping => (
      {...mapping,
        weighting: only_mapping_rating ? mapping.weighting : genreMapping.weighting * mapping.weighting,
      }));

    return idealMappings;
  };

  getAllTrackMappings = () => {
    let allTrackMappings = [];

    const trackMappingFunc = this.getTrackMapping;

    this.state.genreMappings.forEach(function(genreMapping) {
      genreMapping.track_mappings.forEach(function(trackMapping) {
        allTrackMappings.push(...trackMappingFunc(trackMapping, false))
      });
    });

    return allTrackMappings;
  };

  getTrackBeats = (newTracks) => {
    let trackToIterate = this.state.tracks;

    if(newTracks) {
      trackToIterate = newTracks;
    }

    let trackBeats = [];

    trackToIterate.forEach(function(track) {
      trackBeats.push(track.beats)
    });

    return trackBeats;
  };

  generatePopulation = () => {
    // Will break if no tracks...
    const numBeats = this.state.tracks[0].length;
    const numInstruments = this.state.tracks.length;

    const sequentialMappingsWithWeightings = this.getAllTrackMappings();

    return new Population(numBeats, numInstruments, sequentialMappingsWithWeightings, this.getTrackBeats());
    };

  runGA = numTimes => {
    let population = this.generatePopulation();

    population.runNTimes(numTimes);
    const newTrackBeats = population.returnBestFit();

    if (newTrackBeats.length !== this.state.tracks.length){
      throw "new track beats created do not map to the tracks already in the state."
    }

    let newTracks = this.state.tracks;
    this.state.tracks.forEach(function(_, trackIndex) {
      newTracks[trackIndex].beats = newTrackBeats[trackIndex]
    });

    this.updateTracks(newTracks);
  };

  getFormattedTrackDetails = () => {
    let tracksDetailsFormatted = [];
    // let allTrackNames = [];
    // let allTrackWeightings = [];

    this.state.genreMappings.forEach(genreMapping => {
      genreMapping.track_mappings.forEach(trackMapping => {
        tracksDetailsFormatted.push({title: trackMapping.name, value: trackMapping.weighting, color: trackMapping.color});
      })
    });

    // let totalWeightings = 0;
    // tracksRelativeDetails.forEach(relativeDetails => totalWeightings += relativeDetails.weighting);

    // tracksRelativeDetails.forEach((relativeDetails, index) => tracksRelativeDetails[index]['relativePercentage'] = totalWeightings > 0 ? relativeDetails.weighting/totalWeightings : 0);

    return tracksDetailsFormatted;
  };

  displayIterationContext = numIterations => {
    let text = 'Huge';

    switch(true) {
      case numIterations < 3:
        text = 'Tiny';
        break;
      case numIterations < 6:
        text = 'Very Small';
        break;
      case numIterations < 10:
        text = 'Little';
        break;
      case numIterations < 15:
        text = 'Normal';
        break;
      case numIterations < 30:
        text = 'Big ';
        break;
      case numIterations < 60:
        text = 'Very Big';
        break;
      case numIterations <= 100:
        text = 'Huge';
        break;
    }

    return text;
  };

  render() {
    const {bpm, currentBeat, playing, shareHash, tracks} = this.state;
    const {updateBPM, start, stop, addTrack, share, randomSong, closeDialog} = this;
    return (
      <div className="app">
        <h2><i>jammajam</i></h2>
        {shareHash ?
          <ShareDialog hash={shareHash} closeDialog={closeDialog} /> : null}
        <h4>My Beat</h4>
        <table>
          <thead>
            <tr>
              <td colSpan="19">
                <p style={{textAlign: "right"}}>
                  <Button type="primary" onClick={randomSong}>I am uninspired, get me some random tracks</Button>
                </p>
              </td>
            </tr>
          </thead>
          <TrackListView
            tracks={tracks}
            currentBeat={currentBeat}
            toggleTrackBeat={this.toggleTrackBeat}
            setTrackVolume={this.setTrackVolume}
            updateTrackSample={this.updateTrackSample}
            muteTrack={this.muteTrack}
            randomSong={this.randomSong}
            clearTrack={this.clearTrack}
            deleteTrack={this.deleteTrack} />
          <Controls {...{bpm, updateBPM, playing, start, stop, addTrack, share}} />
        </table>
        <h4>Beat Updates</h4>
        <div className="options-overall-container">
          <Collapse
            bordered={false}
            defaultActiveKey={['0']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            className="options-collapsable-container"
          >
            {this.state.genreMappings.map((genreMapping, genreIndex) => (
              <Panel header={genreMapping.name} key={genreIndex} className="site-collapse-custom-panel">
                <div className="options-container">
                  {genreMapping.track_mappings.map(trackMapping =>
                    (<GenreOption
                      genreFitnessMapping={trackMapping}
                      updateGenreSlider={this.updateGenreSlider}
                      tracksFitness={Math.round(this.state.tracksDNA.calcFitness(this.getTrackMapping(trackMapping, true)) * 100)} />
                    ))}
                </div>
              </Panel>
              ))}
          </Collapse>
          <div className={'iterate-container'}>
            <Button className={'iterate-button'} onClick={() => this.runGA(this.state.numIterations)} type="primary">
              Iterate to Update the Beat
            </Button>
            <IteratePercentChart formattedTracksDetails={this.getFormattedTrackDetails()}/>
            <div className={"iterate-amnt-container"}>
              <p>How big of a 'jump' do you want the beat to make?</p>
              <p>{this.displayIterationContext(this.state.numIterations)}</p>
              <div className={"iterate-amnt-slider"}>
                <Slider min={0} max={100} step={1} value={this.state.numIterations} tipFormatter={this.displayIterationContext}
                        onChange={value => this.updateNumIterations(parseFloat(value))} />

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
