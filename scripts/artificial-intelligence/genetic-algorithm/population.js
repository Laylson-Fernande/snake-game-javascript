class Population {
    chromosomes = [];

    constructor(length) {
        this.chromosomes.length = length;
    }

    sortChromosomeByFitness(){
        this.chromosomes.sort( function(a,b){
            return b.getFitness() - a.getFitness();
        })
    }
    
    initializePopulation(){
        for(let i = 0, size = this.chromosomes.length; i < size; i++){
            this.chromosomes[i] = new Chromosome(GeneticAlgorithm.TARGET_CHROMOSOME.length).initializeChromosome();
        }
        return this;
    }
}