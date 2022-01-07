class TrainingManager {
    areaSize = 16;
    populationSize = 10;

    input = [];
    snakes = [];
    genetic;
    constructor(parameters) {
        if (parameters.areaSize) {
            this.areaSize = parameters.areaSize;
        }
        if (parameters.populationSize) {
            this.populationSize = parameters.populationSize;
        }
        for (let i = 0; i < this.areaSize; i++) {
            for (let j = 0; j < this.areaSize; j++) {
                input[i * j] = 0;
            }
        }

        for (let i = 0; i < this.populationSize; i++) {
            snakes[i] = new SnakeTrainer(parameters);
        }
    }
}


function initializeManager() {
    for (let i = 0; i < areaSize; i++) {
        for (let j = 0; j < areaSize; j++) {
            input[i * j] = 0;
        }
    }

    for (let i = 0; i < populationSize; i++) {
        snakes[i] = new SnakeTrainer();
    }
}