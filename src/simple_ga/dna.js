

export default function DNA(numBeats, mutationRate, genes) {
  this.numBeats = numBeats;
  this.mutationRate = mutationRate;
  this.fitness = 0;

  // Recieves genes and create a dna object
  if (genes) {
    this.genes = genes;
  }
  // If no genes just create random dna
  else {
    this.genes = [false]*this.numBeats;

    let i = 0;
    while(i < this.genes.length) {
      this.genes[i] = Math.random() > 0.5;
      i ++;
    }
  }

  // Performs a crossover with another member of the species
  this.crossover = function(partner) {
    let newgenes = [];

    // Picks random midpoint
    let mid = Math.floor(Math.random() * this.genes.length);

    for (let i = 0; i < this.genes.length; i++) {
      // If i is greater than mid the new gene should come from this partner
      if (i > mid) {
        newgenes[i] = this.genes[i];
      }
      // If i < mid new gene should come from other partners gene's
      else {
        newgenes[i] = partner.genes[i];
      }
    }
    // Gives DNA object an array
    return new DNA(this.numBeats, this.mutationRate, newgenes);
  };

  // Adds random mutation to the genes to add variance.
  this.mutation = function() {
    for (let i = 0; i < this.genes.length; i++) {
      // if random number less than mutationRate new gene is then random vector
      if (Math.random(1) < this.mutationRate) {
        this.genes[i] = Math.random() > 0.5;
      }
    }
  };

  this.calcFitness = function(target) {
    console.log('my genes are', this.genes);
    console.log('my target is', target);
    if (target.length !== this.genes.length) {
      throw 'target and genes not equal';
    }

    let score = 0;
    for (let i = 0; i < this.genes.length; i++) {
      if (target[i] ==  this.genes[i]) {
        if (target[i]) {
          score += 1;
        } else {
          score += 0.5;
        }
      }
    }

    this.fitness = score;
  }
}