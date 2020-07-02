const fetch = require("node-fetch");
const fs = require('fs');
const { Midi } = require('@tonejs/midi')


// Constructor function
function Track(dna) {
    const midiData = fs.readFileSync("BEAT1.mid");
    this.midi = new Midi(midiData);
    if (this.midi.tracks.legnth() > 0) {
      this.track = this.midi.tracks[0];
    } else {
      this.track = None;
    }
    // Gives a track dna
    if (dna) {
      this.dna = dna;
    } else {
      this.dna = new DNA();
    }
    this.fitness = 0;
    this.completed = false;
  
    // Calulates fitness of rocket

    // We want to check if track is close to the target genre. Could use track.notes to determine this
    // Assuming 16 beat tracks, we could analyse how many notes match up to the specified genre.
    this.calcFitness = function(base_notes) {
      var similarities = this.track.notes.filter(x => base_notes.includes(x)); // Get the # of notes in track that are similar to the targetted genre
      console.log(similarities);
      
      // Maps range of fitness
      this.fitness = similarities.length()/this.track.notes.length()
      
      // If track gets to target genre, increase fitness score
      if (this.completed) {
        this.fitness *= 10;
      }
    };

    
    // Updates state of the track
    this.update = function() {
      // Checks distance from rocket to target
      var d = dist(this.pos.x, this.pos.y, target.x, target.y);
      // If distance less than 10 pixels, then it has reached target
      if (d < 10) {
        this.completed = true;
        this.pos = target.copy();
      }
      // Rocket hit the barrier
      if (
        this.pos.x > rx &&
        this.pos.x < rx + rw &&
        this.pos.y > ry &&
        this.pos.y < ry + rh
      ) {
        this.crashed = true;
      }
      // Rocket has hit left or right of window
      if (this.pos.x > width || this.pos.x < 0) {
        this.crashed = true;
      }
      // Rocket has hit top or bottom of window
      if (this.pos.y > height || this.pos.y < 0) {
        this.crashed = true;
      }
  
      //applies the random vectors defined in dna to consecutive frames of rocket
      this.applyForce(this.dna.genes[count]);
      // if rocket has not got to goal and not crashed then update physics engine
      if (!this.completed && !this.crashed) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.vel.limit(4);
      }
    };
  }