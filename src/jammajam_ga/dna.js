

export default function DNA(numBeats, numInstruments, mutationRate, genes) {
  this.numBeats = numBeats;
  this.numInstruments = numInstruments;
  this.mutationRate = mutationRate;
  this.fitness = 0;

  // List of lists, outer list corresponds to each instrument and inner list is for each set of beats.
  // Beats will be true or false, corresponding to hit or not hit.
  // Example with 2 instruments: [[true, false, false, false, true, false...], [true, false, false, false, true, false...]]
  this.genes = [];

  // Recieves genes and create a dna object
  if (genes) {
    this.genes = genes;
  }
  // If no genes just create random dna
  else {
    this.genes = new Array(numInstruments);
    // If using this double check that each array of numbeats is instantiated new...
    this.genes.fill(new Array(numBeats));

    this.genes.forEach(function(gene){
      let i = 0;
      while(i < gene.length) {
        genes[i] = Math.random() > 0.5;
        i ++;
      }
    });
  }

  // Performs a crossover with another member of the species
  this.crossover = function(partner) {
    let newGenes = [];

    this.genes.forEach(function(gene, index){
      let newGene = [];

      // Picks random midpoint
      let mid = Math.floor(Math.random() * gene.length);

      for (let i = 0; i < gene.length; i++) {
        // If i is greater than mid the new gene should come from this partner
        if (i > mid) {
          newGene[i] = gene[i];
        }
        // If i < mid new gene should come from other partners gene's
        else {
          newGene[i] = partner.genes[index][i];
        }
      }

      newGenes.push(newGene);
    });

    // Gives DNA object an array
    return new DNA(this.numBeats, this.numInstruments, this.mutationRate, newGenes);
  };

  // Adds random mutation to the genes to add variance.
  this.mutation = function(mutationRate) {
    let newGenes = this.genes;
    this.genes.forEach(function(gene, index) {
      for (let i = 0; i < gene.length; i++) {
        // if random number less than mutationRate new gene is then random vector
        if (Math.random(1) < mutationRate) {
          newGenes[index][i] = Math.random() > 0.5;
        }
      }
    });
    this.genes = newGenes;
  };

  this.calcFitness = function(sequentialMappings, nonHitScore, hitScore) {
    // console.log('About to calcFitness, my genes are', this.genes);
    // console.log('The mappings to use are: ', sequentialMappings);

    let score = 0;

    const myGenes = this.genes;
    sequentialMappings.forEach(function(mapping) {
      if (mapping.weighting !== 0) {
        let correspondingGene = myGenes[mapping.trackIndex];
        if(correspondingGene.length !== mapping.beats.length) {
          throw "The gene does not match the mapping of beats passed into the fitness function."
        }

        for (let i = 0; i < correspondingGene.length; i++) {
          // intentially leaving type coercion in case developer uses other representation of true and false.
          if (mapping.beats[i] ==  correspondingGene[i]) {
            if (mapping[i]) {
              score += hitScore * mapping.weighting;
            } else {
              score += nonHitScore * mapping.weighting;
            }
          } else {
            score -= 1 * mapping.weighting;
          }
        }
      }
    });

    // console.log('score was: ', score);

    this.fitness = score;
  }
}