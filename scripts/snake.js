class Snake {
    body = [];
    direction = {
        x: 1,
        y: 0
    }
}

class SnakeTrainer extends Snake {
    neural;
    fitness = 0;
    genes = [];

    isAlive = true;
    constructor(parameters) {
        if (parameters.neuralLayers && parameters.learningRate) {
            this.neural = new Network(parameters.neuralLayers, parameters.learningRate);
        }
        this.genes.length = length;
    }

    initializeChromosome() {

        this.fitness = this.recalculateFitness();
        return this;
    }
}