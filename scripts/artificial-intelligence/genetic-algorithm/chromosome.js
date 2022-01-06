class Chromosome {
    isFitnessChanged = true;
    fitness = 0;
    genes = [];

    constructor(length) {
        this.genes.length = length;
    }

    recalculateFitness(){
        let chromosomeFitness = 0;
        for(let i = 0, size = this.genes.length; i < size; i++){
            if(this.genes[i] == GeneticAlgorithm.TARGET_CHROMOSOME[i]){
                chromosomeFitness++;
            }
        }
        return chromosomeFitness;
    }

    initializeChromosome() {
        for (let i = 0, size = this.genes.length; i < size; i++) {
            if (Math.random() >= 0.5) {
                this.genes[i] = 1;
            } else {
                this.genes[i] = 0;
            }
        }

        this.fitness = this.recalculateFitness();
        return this;
    }

    toString(){
        return this.genes;
    }

    getGenes(){
        this.isFitnessChanged = true;
        return this.genes;
    }

    getFitness() {
        if(this.isFitnessChanged){
            this.fitness = this.recalculateFitness();
            this.isFitnessChanged = false;
        }
        return this.fitness;
    }
}