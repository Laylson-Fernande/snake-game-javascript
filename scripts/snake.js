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
    constructor(initialize) {
        if (TrainingManager.NEURAL_LAYERS && TrainingManager.LEARNING_RATE) {
            this.neural = new Network(TrainingManager.NEURAL_LAYERS, TrainingManager.LEARNING_RATE);
        }
        if (initialize && this.neural) {
            this.genes = this.neural.getGenes();
        } else {
            this.genes.length = TrainingManager.GENES_SIZE;
        }
    }

    sumFitness(sum) {
        this.fitness = this.fitness + sum;
    }

    getGenes() {
        return this.genes();
    }

    getFitness() {
        return this.fitness;
    }
}