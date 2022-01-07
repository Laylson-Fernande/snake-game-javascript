class TrainingManager {
    static AREA_SIZE;
    static POPULATION_SIZE;
    static GENES_SIZE;
    static NEURAL_LAYERS;
    static LEARNING_RATE;
    static NUMBER_ELITE_CHROMOSOMES;
    static TOURNAMENT_SELECTION_SIZE;
    static MUTATION_RATE;

    static REMAINING_POPULATION = 0;

    input = [];
    population;
    genetic;
    generationNumber = 0;
    constructor(parameters) {
        if (parameters.areaSize) {
            TrainingManager.AREA_SIZE = parameters.areaSize;
        }
        if (parameters.populationSize) {
            TrainingManager.POPULATION_SIZE = parameters.populationSize;
            TrainingManager.REMAINING_POPULATION = parameters.populationSize;
        }
        if (parameters.neuralLayers) {
            TrainingManager.NEURAL_LAYERS = parameters.neuralLayers;
        }
        if (parameters.learningRate) {
            TrainingManager.LEARNING_RATE = parameters.learningRate;
        }
        if (parameters.mutationRate) {
            TrainingManager.MUTATION_RATE = parameters.mutationRate;
        }
        if (TrainingManager.POPULATION_SIZE) {
            if (parameters.percentEliteChromosomes) {
                TrainingManager.NUMBER_ELITE_CHROMOSOMES = Math.floor(TrainingManager.POPULATION_SIZE / parameters.percentEliteChromosomes);
            }

            if (parameters.percentTournamentSelection) {
                TrainingManager.TOURNAMENT_SELECTION_SIZE = Math.floor(TrainingManager.POPULATION_SIZE / parameters.percentTournamentSelection);
            }
        }

        for (let i = 0; i < TrainingManager.AREA_SIZE; i++) {
            for (let j = 0; j < TrainingManager.AREA_SIZE; j++) {
                input[i * j] = 0;
            }
        }

        this.population = new Population(TrainingManager.POPULATION_SIZE);
        for (let i = 0; i < TrainingManager.POPULATION_SIZE; i++) {
            this.population.chromosomes[i] = new SnakeTrainer(true);
        }

        this.genetic = new GeneticAlgorithm();
    }

    training(_input) {
        if (TrainingManager.REMAINING_POPULATION <= 0) {
            this.evolve();
        }
        _input = this.prepareInput(_input);
    }

    prepareInput(_input) {
        let result = this.input.slice(0);
        if (_input.food) {
            let food = _input.food;
            result[food.x][food.y] = 100;
        }
        return result;
    }

    evolve() {
        this.population = this.genetic.evolve(this.population);
        TrainingManager.REMAINING_POPULATION = TrainingManager.POPULATION_SIZE;
        this.generationNumber++;
    }

    predictPopulation() {

    }

    getSnakes() {
        return this.population.chromosomes;
    }

}