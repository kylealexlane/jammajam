import DNA from "./dna.js";


export default function Population(numBeats=16, numInstruments, target, startingBeat, nonHitScore=1, hitScore=1) {
  // Array of tracks
  this.tracks = [];

  this.target = target;

  // Amount of tracks
  this.popsize = 100;

  this.mutationRate = 0.01;

  // Amount parent track partners
  this.matingpool = [];

  this.nonHitScore = nonHitScore;
  this.hitScore = hitScore;

  // Populate tracks
  for (let i = 0; i < this.popsize; i++) {
    this.tracks[i] = new DNA(numBeats, numInstruments, this.mutationRate, startingBeat);
  }

  this.evaluate = function() {
    let maxfit = 0;
    // Iterate through all tracks and calculates their fitness
    for (let i = 0; i < this.tracks.length; i++) {
      // Calculates fitness
      this.tracks[i].calcFitness(this.target, this.nonHitScore, this.hitScore);
      // If current fitness is greater than max, then make max equal to current
      if (this.tracks[i].fitness > maxfit) {
        maxfit = this.tracks[i].fitness;
      }
    }
    // Normalises fitnesses
    for (let i = 0; i < this.tracks.length; i++) {
      this.tracks[i].fitness /= maxfit;
    }

    // console.log('in evaluate, adding to mating pool..', this.matingpool);
    this.matingpool = [];
    // Take tracks fitness make in to scale of 1 to 100
    // A rocket with high fitness will highly likely will be in the mating pool
    for (let i = 0; i < this.tracks.length; i++) {
      let n = this.tracks[i].fitness * 100;
      for (let j = 0; j < n; j++) {
        this.matingpool.push(this.tracks[i]);
      }
    }
    // console.log('in evaluate, done adding to matingpool..', this.matingpool);

  };

  // Selects appropriate genes for child
  this.selection = function() {
    // console.log('about to start selection, mating pool is: ', this.matingpool);
    let newTracks = [];
    for (let i = 0; i < this.tracks.length; i++) {
      // Picks random dna
      let parentA = this.matingpool[Math.floor(Math.random() * this.matingpool.length)];
      let parentB = this.matingpool[Math.floor(Math.random() * this.matingpool.length)];
      // Creates child by using crossover function
      let child = parentA.crossover(parentB);
      child.mutation(this.mutationRate);
      // Creates new rocket with child dna
      newTracks[i] = child;
    }
    // This instance of tracks are the new tracks
    // console.log('done selection, tracks are now: ', newTracks);
    this.tracks = newTracks;
  };

  this.returnBestFit = function() {
    let maxfit = 0;
    let currentMax = -1;

    // Iterate through all rockets and calcultes their fitness
    for (let i = 0; i < this.tracks.length; i++) {
      // Calculates fitness
      this.tracks[i].calcFitness(this.target, this.nonHitScore, this.hitScore);
      // If current fitness is greater than max, then make max equal to current
      if (this.tracks[i].fitness > maxfit) {
        maxfit = this.tracks[i].fitness;
        currentMax = i;
      }
    }

    return this.tracks[currentMax].genes;
  };

  this.runNTimes = function(numTimes) {
    let i = 0;
    while (i < numTimes) {
      this.evaluate();
      this.selection();

      i ++;
    }
  }

  // // Calls for update and show functions
  // this.run = function() {
  //   for (var i = 0; i < this.popsize; i++) {
  //     this.rockets[i].update();
  //     // Displays rockets to screen
  //     this.rockets[i].show();
  //   }
  // };
}