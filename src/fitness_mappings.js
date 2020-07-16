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
  ride

 */

const KICK = 'kick'; // kick-acoustic02
const SNARE = 'snare'; // snare-acoustic02
const HIHAT = 'hihat'; // hithat-acoustic02
const RIDE = 'ride'; // ride-acoustic02


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
    // Base if for everything to be weighted equally (when fitness function is working it will evaluate everything equally).
    let weighting = 1;

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    // if the sound is in the Kick category, then ideal is every 4 beats starting with 0th beat
    if(track.name.includes(KICK)){
      idealBeats[0] = true;
      idealBeats[2] = true;
      idealBeats[6] = true;
      idealBeats[8] = true;
      idealBeats[10] = true;
      idealBeats[14] = true;


      // for(let i = 0; i < numBeats; i++) {
      //   if (((i + 4) % 4) === 0) {
      //     idealBeats[i] = true;
      //   }
      // }
      // The rock kick pattern is really important
      weighting = 3;
    } else if(track.name.includes(SNARE)) {
      // if sound is in snare category, ideal pattern is every 4 beats starting with 2nd beat
      idealBeats[4] = true;
      idealBeats[12] = true;
      // idealBeats[6] = true;
      // idealBeats[8] = true;
      // idealBeats[10] = true;
      // idealBeats[14] = true;
      // for(let i = 0; i < numBeats; i++) {
      //   if (((i + 2) % 4) === 0) {
      //     idealBeats[i] = true;
      //   }
      // }
    } else if(track.name.includes(HIHAT)){
      // if sound is in hihat category, ideal pattern is hitting every beat
      for(let i = 0; i < numBeats; i++) {
        if (((i + 2) % 2) === 0) {
          idealBeats[i] = true;
        }
      }
    } else {
      // For any other category, ideal pattern is not hitting the instrument.
      idealBeats.fill(false);
    }

    console.log('rock mapping for trackingdex', trackIndex, 'is', idealBeats);
    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });


  return idealTrackMappings;
}


export function four_on_flour(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if ((numBeats % 4) !== 0) {
    throw "Expecting numBeats to be a multiple of 4."
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    // Base if for everything to be weighted equally (when fitness function is working it will evaluate everything equally).
    let weighting = 1;

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    if(track.name.includes(KICK)){
      idealBeats[0] = true;
      idealBeats[4] = true;
      idealBeats[8] = true;
      idealBeats[12] = true;
      // The rock kick pattern is really important
      weighting = 3;
    } else if(track.name.includes(SNARE)) {
      idealBeats[4] = true;
      idealBeats[12] = true;
    } else if(track.name.includes(HIHAT)){
      idealBeats[2] = true;
      idealBeats[6] = true;
      idealBeats[10] = true;
      idealBeats[14] = true;
    } else if(track.name.includes(RIDE)){
      idealBeats[4] = true;
      idealBeats[12] = true;
    } else {
      // For any other category, ideal pattern is not hitting the instrument.
      idealBeats.fill(false);
    }

    console.log('rock mapping for trackingdex', trackIndex, 'is', idealBeats);
    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });


  return idealTrackMappings;
}

export function funky_drummer_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if ((numBeats % 4) !== 0) {
    throw "Expecting numBeats to be a multiple of 4."
  }
  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    // Base if for everything to be weighted equally (when fitness function is working it will evaluate everything equally).
    let weighting = 1;

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    // if the sound is in the Kick category, then ideal is at beats 1, 2, 11, 14
    if(track.name.includes(KICK)){
      idealBeats[0] = true;
      idealBeats[1] = true;
      idealBeats[10] = true;
      idealBeats[13] = true;
      weighting = 2;
    } else if(track.name.includes(SNARE)) {
      // if sound is in snare category, ideal pattern is at beats 5, 8, 10, 12, 13, 16
      idealBeats[4] = true;
      idealBeats[7] = true;
      idealBeats[9] = true;
      idealBeats[11] = true;
      idealBeats[12] = true;
      idealBeats[15] = true;
      weighting = 1;
    } else if(track.name.includes(HIHAT)){
      // if sound is in hihat category, ideal pattern is hitting every beat except for beats 8 and 13
      idealBeats.fill(true);
      idealBeats[7] = false;
      idealBeats[12] = false;
      weighting = 1
    } else if(track.name.includes(RIDE)){
      // if sound is in hihat category, ideal pattern is none
      idealBeats.fill(false);
      weighting = 1
    }else {
      // For any other category, ideal pattern is not hitting the instrument.
      idealBeats.fill(false);
    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });

  return idealTrackMappings;
}

export function levee_break_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if ((numBeats % 4) !== 0) {
    throw "Expecting numBeats to be a multiple of 4."
  }
  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    // Base if for everything to be weighted equally (when fitness function is working it will evaluate everything equally).
    let weighting = 1;

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    // if the sound is in the Kick category, then ideal is at beats 1, 2, 8, 11, 12
    if(track.name.includes(KICK)){
      idealBeats[0] = true;
      idealBeats[1] = true;
      idealBeats[7] = true;
      idealBeats[10] = true;
      idealBeats[11] = true;
      weighting = 2;
    } else if(track.name.includes(SNARE)) {
      // if sound is in snare category, ideal pattern is at beats 5, 13
      idealBeats[4] = true;
      idealBeats[12] = true;
      weighting = 1;
    } else if(track.name.includes(HIHAT)){
      // if sound is in hihat category, ideal pattern is hitting every odd beat
      for(let i = 0; i < numBeats; i++) {
        if (((i+1) % 2) === 1) {
          idealBeats[i] = true;
        }
      }
      weighting = 1;
    } else if(track.name.includes(RIDE)){
      // if sound is in hihat category, ideal pattern is none
      idealBeats.fill(false);
      weighting = 1;
    } else {
      // For any other category, ideal pattern is not hitting the instrument.
      idealBeats.fill(false);
    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });

  return idealTrackMappings;
}

export function son_clave_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if ((numBeats % 4) !== 0) {
    throw "Expecting numBeats to be a multiple of 4."
  }
  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    // Base if for everything to be weighted equally (when fitness function is working it will evaluate everything equally).
    let weighting = 1;

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    // if the sound is in the Kick category, then ideal is at beats 1, 4, 5, 8, 9, 12, 13, 16
    if(track.name.includes(KICK)){
      idealBeats[0] = true;
      idealBeats[3] = true;
      idealBeats[4] = true;
      idealBeats[7] = true;
      idealBeats[8] = true;
      idealBeats[11] = true;
      idealBeats[12] = true;
      idealBeats[15] = true;
      weighting = 3;
    } else if(track.name.includes(SNARE)) {
      // if sound is in snare category, ideal pattern is at beats 1, 4, 7, 11, 13
      idealBeats[0] = true;
      idealBeats[3] = true;
      idealBeats[6] = true;
      idealBeats[10] = true;
      idealBeats[12] = true;
      weighting = 1;
    } else if(track.name.includes(RIDE)){
      // if sound is in hihat category, ideal pattern is hitting every beat
      idealBeats.fill(true);
      weighting = 1;
    } else {
      // For any other category, ideal pattern is not hitting the instrument.
      idealBeats.fill(false);
    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });

  return idealTrackMappings;
}

export function kick_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if ((numBeats % 4) !== 0) {
    throw "Expecting numBeats to be a multiple of 4."
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    // if the sound is in the Kick category, then ideal is every 4 beats starting with 0th beat
    if(track.name.includes(KICK)){
      for(let i = 0; i < numBeats; i++) {
        idealBeats[i] = true
      }
    }
    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: 1});
  });

  return idealTrackMappings;
}

export function snare_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if ((numBeats % 4) !== 0) {
    throw "Expecting numBeats to be a multiple of 4."
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    // if the sound is in the Kick category, then ideal is every 4 beats starting with 0th beat
    if(track.name.includes(SNARE)){
      for(let i = 0; i < numBeats; i++) {
          idealBeats[i] = true
      }
    }
    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: 1});
  });

  return idealTrackMappings;
}

export function hihat_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if ((numBeats % 4) !== 0) {
    throw "Expecting numBeats to be a multiple of 4."
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {

    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);

    // if the sound is in the Kick category, then ideal is every 4 beats starting with 0th beat
    if(track.name.includes(HIHAT)){
      for(let i = 0; i < numBeats; i++) {
        idealBeats[i] = true
      }
    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: 1});
  });

  return idealTrackMappings;
}



