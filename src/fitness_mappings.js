/*
'Styles' of music need to have different ideal sounds for each instrument category that the fitness function can work
towards. For example, in a standard Rock beat the ideal kick pattern is different than the ideal snare pattern.

Different categories for the sounds are:
  clap
  cowbell
  crash
  hihat
  kick
  openhat
  perc
  ride
  shaker
  snare
  tom



  Currently focusing on:
  kick
  snare
  hihat

 */

const KICK = 'kick';
const SNARE = 'snare';
const HIHAT = 'hihat';


export function rock_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if ((numBeats % 4) !== 0) {
    throw "Expecting numBeats to be a multiple of 4."
  }

  // Will be list containing a dictionary for each mapping.
  // Each mapping will have the following data type:
  // { beats: [true, false, false, ...], trackIndex: int, weighting: 1}
  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    // if the sound is in the Kick category, then ideal is every 4 beats starting with 0th beat
    if(track.name.includes(KICK)){
      for(let i = 0; i < numBeats; i++) {
        if (((i + 4) % 4) === 0) {
          idealBeats[i] = true
        }
      }
    } else if(track.name.includes(SNARE)) {
      // if sound is in snare category, ideal pattern is every 4 beats starting with 2nd beat
      for(let i = 0; i < numBeats; i++) {
        if (((i + 2) % 4) === 0) {
          idealBeats[i] = true
        }
      }
    } else if(track.name.includes(HIHAT)){
      // if sound is in hihat category, ideal pattern is hitting every beat
      idealBeats.fill(true)
    } else {
      // For any other category, ideal pattern is not hitting the instrument.
      idealBeats.fill(false)
    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: 1});
  });


  return idealTrackMappings;
}
