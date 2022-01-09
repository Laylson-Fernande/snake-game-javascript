class TrainingManager {
    static AREA_SIZE;
    static POPULATION_SIZE;
    static GENES_SIZE = 0;
    static NEURAL_LAYERS;
    static LEARNING_RATE;
    static NUMBER_ELITE_CHROMOSOMES;
    static TOURNAMENT_SELECTION_SIZE;
    static MUTATION_RATE;

    static FOOD_VALUE = 2000;
    static HEAD_VALUE = 300;
    static DIRECTION_MULTIPLIER = 600;

    static SCORE_CHANGE_DIRECTIN = 150;
    static SCORE_BY_SURVIVOR = 0;
    static SCORE_BY_FOOD = 300;
    static SCORE_DISTANCE_FOOD = 0;

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
        if (parameters.food_value) {
            TrainingManager.FOOD_VALUE = parameters.food_value;
        }
        if (parameters.head_value) {
            TrainingManager.HEAD_VALUE = parameters.head_value;
        }
        if (parameters.direction_multiplier) {
            TrainingManager.DIRECTION_MULTIPLIER = parameters.direction_multiplier;
        }
        if (parameters.learningRate) {
            TrainingManager.LEARNING_RATE = parameters.learningRate;
        }
        if (parameters.mutationRate) {
            TrainingManager.MUTATION_RATE = parameters.mutationRate;
        }
        if (TrainingManager.POPULATION_SIZE) {
            if (parameters.percentEliteChromosomes) {
                TrainingManager.NUMBER_ELITE_CHROMOSOMES = Math.floor(TrainingManager.POPULATION_SIZE * parameters.percentEliteChromosomes);
            }

            if (parameters.percentTournamentSelection) {
                TrainingManager.TOURNAMENT_SELECTION_SIZE = Math.floor(TrainingManager.POPULATION_SIZE * parameters.percentTournamentSelection);
            }
        }

        this.input.length = TrainingManager.AREA_SIZE * TrainingManager.AREA_SIZE;
        for (let i = 0, size = this.input.length; i < size; i++) {
            this.input[i] = 0;
        }

        this.population = new Population(TrainingManager.POPULATION_SIZE);
        for (let i = 0; i < TrainingManager.POPULATION_SIZE; i++) {
            this.population.chromosomes[i] = new SnakeTrainer(true);
        }

        this.genetic = new GeneticAlgorithm();
        return this;
    }

    training(_input) {
        if (TrainingManager.REMAINING_POPULATION <= 0 || _input.forceNextGen) {
            this.population.sortChromosomeByFitness();
            let best = this.population.chromosomes[0];
            console.log("Next Generation: " + this.generationNumber + " Best Fitness Last Generation: "+ best.getFitness() + " Number of changes direction: "+best.numberChangesDirection);
            console.log("--------------------");
            this.evolve();
        }
        _input = this.prepareInput(_input);
        let result = this.predictPopulation(_input);
        result.sort(function (a, b) {
            return b.getFitness() - a.getFitness();
        });
        return result;
    }

    prepareInput(_input) {
        let data = this.input.slice(0);
        _input.data = data;
        return _input;
    }

    addSnakeToInput(_input, snake) {
        let data = _input.data;
        let body = snake.body;
        let head = body[0];
        let direction = snake.direction;

        let index = this.xyToIndex(head.x, head.y);
        data[index] = TrainingManager.HEAD_VALUE;

        data[data.length] = (head.x + direction.x) * TrainingManager.DIRECTION_MULTIPLIER;
        data[data.length] = (head.y + direction.y) * TrainingManager.DIRECTION_MULTIPLIER;
        for (let i = 1; i < body.length; i++) {
            let position = body[i];

            index = this.xyToIndex(position.x, position.y);
            data[index] = -1;
        }
        if (snake.food) {
            let food = snake.food;
            let index = this.xyToIndex(food.x, food.y);
            data[index] = TrainingManager.FOOD_VALUE;
            _input.food = food;
        }

        _input.data = data;
        return _input;
    }

    evolve() {
        this.updateGenesPopulation();
        this.population = this.genetic.evolve(this.population);
        TrainingManager.REMAINING_POPULATION = TrainingManager.POPULATION_SIZE;
        this.generationNumber++;
        this.updateNeuralPopulation();
    }

    updateGenesPopulation() {
        let snakes = this.population.chromosomes;
        for (let i = 0, size = snakes.length; i < size; i++) {
            snakes[i].updateGenes();
        }
    }

    updateNeuralPopulation() {
        let snakes = this.population.chromosomes;
        for (let i = 0, size = snakes.length; i < size; i++) {
            snakes[i].updateNeural();
            snakes[i].createFood();
            snakes[i].isAlive = true;
            snakes[i].fitness = 0;
            snakes[i].numberChangesDirection = 0;
        }
    }

    predictPopulation(_input) {
        let result = [];
        for (let i = 0, size = this.population.chromosomes.length; i < size; i++) {
            let chromosome = this.population.chromosomes[i];
            if (chromosome.isAlive) {
                let survived = this.predictChromosome(_input, chromosome);
                if (!survived) {
                    TrainingManager.REMAINING_POPULATION--;
                }
                result.push(chromosome);
            }
        }
        return result;
    }

    predictChromosome(_input, chromosome) {
        let survived = false;
        let newInput = this.addSnakeToInput(_input, chromosome);


        let predict = this.predict(_input.data, chromosome);
        if (predict != -1) {
            if (predict == 1) {
                chromosome.turnRight();
                chromosome.sumFitness(TrainingManager.SCORE_CHANGE_DIRECTIN);
            } else if (predict == 2) {
                chromosome.turnLeft();
                chromosome.sumFitness(TrainingManager.SCORE_CHANGE_DIRECTIN);
            }
            let head = chromosome.body[0];
            let newHead = {
                x: head.x + chromosome.direction.x,
                y: head.y + chromosome.direction.y
            }
            let index = this.xyToIndex(newHead.x, newHead.y);
            let target = _input.data[index];
            if (target != -1) {
                survived = true;
                chromosome.sumFitness(TrainingManager.SCORE_BY_SURVIVOR);
                if (target == TrainingManager.FOOD_VALUE) {
                    chromosome.updateBody(true, TrainingManager.areaSize);
                    chromosome.sumFitness(TrainingManager.SCORE_BY_FOOD);
                    chromosome.createFood(_input.data);
                } else {
                    chromosome.updateBody(false, TrainingManager.areaSize);
                    let food = _input.food;
                    if (food) {
                        let distance_x = Math.max(food.x, newHead.x) - Math.min(food.x, newHead.x);
                        let distance_y = Math.max(food.y, newHead.y) - Math.min(food.y, newHead.y);
                        let distance = distance_x + distance_y;
                        let score = ((TrainingManager.AREA_SIZE - 1) * 2) - distance;
                        chromosome.sumFitness(score * TrainingManager.SCORE_DISTANCE_FOOD);

                    }
                }
            } else {
                chromosome.updateBody(false);
                chromosome.isAlive = false;
            }
        } else {
            console.log("Invalid Result");
        }
        return survived;
    }

    predict(_input, chromosome) {
        let predict = chromosome.predict(_input);
        let result = 0;
        if (predict[0] < 0.5 && predict[1] < 0.5) {
            result = 0;
        } else if (predict[0] >= 0.5 && predict[1] < 0.5) {
            result = 1;
        } else if (predict[1] >= 0.5 && predict[0] < 0.5) {
            result = 2;
        }
        return result;
    }


    getSnakes() {
        return this.population.chromosomes;
    }

    xyToIndex(x, y) {
        return (x * (TrainingManager.AREA_SIZE - 1)) + y;
    }

}