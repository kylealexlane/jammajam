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
  if (tracks[0].beats.length !== 16) {
    throw "Expecting numBeats to be 16"
  }

  // Will be list containing a dictionary for each mapping.
  // Each mapping will have the following data type:
  // { beats: [true, false, false, ...], trackIndex: int, weighting: number}
  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);
    let weighting = 0.5;

    // if the sound is in the Kick category, then ideal is every 4 beats starting with 0th beat
    if(track.name.includes(KICK)){
      idealBeats[0] = true;
      idealBeats[2] = true;
      idealBeats[6] = true;
      idealBeats[8] = true;
      idealBeats[10] = true;
      idealBeats[14] = true;

      weighting = 1;
    } else if(track.name.includes(SNARE)) {
      idealBeats[4] = true;
      idealBeats[12] = true;

      weighting = 1;
    } else if(track.name.includes(HIHAT)){
      for(let i = 0; i < numBeats; i++) {
        if (((i + 2) % 2) === 0) {
          idealBeats[i] = true;
        }
      }

      weighting = 0.75;
    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });


  return idealTrackMappings;
}


export function four_on_flour(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if (tracks[0].beats.length !== 16) {
    throw "Expecting numBeats to be 16"
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);
    let weighting = 0.5;

    if(track.name.includes(KICK)){
      idealBeats[0] = true;
      idealBeats[4] = true;
      idealBeats[8] = true;
      idealBeats[12] = true;

      // The four on the floor kick pattern is really important
      weighting = 3;
    } else if(track.name.includes(SNARE)) {
      idealBeats[4] = true;
      idealBeats[12] = true;
      weighting = 1;

    } else if(track.name.includes(HIHAT)){
      idealBeats[2] = true;
      idealBeats[6] = true;
      idealBeats[10] = true;
      idealBeats[14] = true;
      weighting = 0.75;

    } else if(track.name.includes(RIDE)){
      idealBeats[4] = true;
      idealBeats[12] = true;
      weighting = 0.75;

    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });


  return idealTrackMappings;
}

export function funky_drummer_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if (tracks[0].beats.length !== 16) {
    throw "Expecting numBeats to be 16"
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);
    let weighting = 0.5;

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
      weighting = 2;

    } else if(track.name.includes(HIHAT)){
      // if sound is in hihat category, ideal pattern is hitting every beat except for beats 8 and 13
      idealBeats.fill(true);
      idealBeats[7] = false;
      idealBeats[12] = false;
      weighting = 0.6;

    } else if(track.name.includes(RIDE)){
      // if sound is in hihat category, ideal pattern is none
      idealBeats.fill(false);
      weighting = 0.6;

    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });

  return idealTrackMappings;
}

export function levee_break_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if (tracks[0].beats.length !== 16) {
    throw "Expecting numBeats to be 16"
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);
    let weighting = 0.5;

    // if the sound is in the Kick category, then ideal is at beats 1, 2, 8, 11, 12
    if(track.name.includes(KICK)){
      idealBeats[0] = true;
      idealBeats[1] = true;
      idealBeats[7] = true;
      idealBeats[10] = true;
      idealBeats[11] = true;
      weighting = 1;

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
      weighting = 0.6;

    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });

  return idealTrackMappings;
}

export function son_clave_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if (tracks[0].beats.length !== 16) {
    throw "Expecting numBeats to be 16"
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);
    let weighting = 0.5;

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
      weighting = 2;

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

    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting: weighting});
  });

  return idealTrackMappings;
}

export function kick_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if (tracks[0].beats.length !== 16) {
    throw "Expecting numBeats to be 16"
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);
    let weighting = 0;

    if(track.name.includes(KICK)){
      idealBeats.fill(true);
      weighting = 1;

    }
    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting});
  });

  return idealTrackMappings;
}

export function snare_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if (tracks[0].beats.length !== 16) {
    throw "Expecting numBeats to be 16"
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);
    let weighting = 0;

    // if the sound is in the Kick category, then ideal is every 4 beats starting with 0th beat
    if(track.name.includes(SNARE)){
      idealBeats.fill(true);
      weighting = 1;
    }
    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting});
  });

  return idealTrackMappings;
}

export function hihat_mapping(tracks) {
  // Assuming the number of beats is consistent for all tracks...
  const numBeats = tracks[0].beats.length;
  if (tracks[0].beats.length !== 16) {
    throw "Expecting numBeats to be 16"
  }

  let idealTrackMappings = [];

  tracks.forEach(function(track, trackIndex) {
    let idealBeats = new Array(numBeats);
    idealBeats.fill(false);
    let weighting = 0;

    // if the sound is in the Kick category, then ideal is every 4 beats starting with 0th beat
    if(track.name.includes(HIHAT)){
      idealBeats.fill(true);
      weighting = 1;
    }

    idealTrackMappings.push({beats: idealBeats, trackIndex: trackIndex, weighting});
  });

  return idealTrackMappings;
}

export const GENREMAPPINGS = [
  {
    name: 'Rock',
    track_mappings: [
      {
        name: 'Classic Rock',
        weighting: 0,
        indices: [0, 0],
        mappingFunc: rock_mapping,
        color: "#eb2f96"
      },
      {
        name: 'Funky Drummer',
        weighting: 0,
        indices: [0, 1],
        mappingFunc: funky_drummer_mapping,
        color: "#722ed1",
      },
      {
        name: 'Levee Break',
        weighting: 0,
        indices: [0, 2],
        mappingFunc: levee_break_mapping,
        color: "#2f54eb",
      },
    ]
  },
  {
    name: 'Reggae',
    track_mappings: [
      {
        name: 'Son Clave',
        weighting: 0,
        indices: [1, 0],
        mappingFunc: son_clave_mapping,
        color: "#13c2c2",
      },
    ],
  },
  {
    name: 'Pop',
    track_mappings: [
      {
        name: 'Four On FLour',
        weighting: 0,
        indices: [2, 0],
        mappingFunc: four_on_flour,
        color: "#52c41a",
      },
    ],
  },
  {
    name: 'Instruments',
    track_mappings: [
      {
        name: 'Kick Prevalence',
        weighting: 0,
        indices: [3, 0],
        mappingFunc: kick_mapping,
        color: "#fadb14",
      },
      {
        name: 'Snare Prevalence',
        weighting: 0,
        indices: [3, 1],
        mappingFunc: snare_mapping,
        color: "#faad14",
      },
      {
        name: 'HiHat Prevalence',
        weighting: 0,
        indices: [3, 2],
        mappingFunc: hihat_mapping,
        color: "#fa541c",
      },
    ]
  },
];

