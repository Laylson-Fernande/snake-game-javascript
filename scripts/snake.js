class Snake {
    body = [];
    direction = {
        x: 1,
        y: 0
    }
    numberChangesDirection = 0;
    turnRight() {
        this.numberChangesDirection++;
        if (this.direction.x == 1) {
            this.direction = {
                x: 0, y: -1
            }
        } else if (this.direction.x - 1) {
            this.direction = {
                x: 0, y: 1
            }
        } else if (this.direction.y == 1) {
            this.direction = {
                x: 1, y: 0
            }
        } else if (this.direction.y == -1) {
            this.direction = {
                x: -1, y: 0
            }
        }
    }

    turnLeft() {
        this.numberChangesDirection++;
        if (this.direction.x == 1) {
            this.direction = {
                x: 0, y: 1
            }
        } else if (this.direction.x - 1) {
            this.direction = {
                x: 0, y: -1
            }
        } else if (this.direction.y == 1) {
            this.direction = {
                x: -1, y: 0
            }
        } else if (this.direction.y == -1) {
            this.direction = {
                x: 1, y: 0
            }
        }
    }

    updateBody(eating, _areaSize) {
        if (this.body.length > 0) {
            let head = this.body[0];
            let newHead = {
                x: head.x + this.direction.x,
                y: head.y + this.direction.y
            }
            if (newHead.x < 0) {
                newHead.x = parameters.areaSize - 1;
            }
            if (newHead.x > parameters.areaSize - 1) {
                newHead.x = 0;
            }
            if (newHead.y < 0) {
                newHead.y = parameters.areaSize - 1;
            }
            if (newHead.y > parameters.areaSize - 1) {
                newHead.y = 0;
            }
            this.body.unshift(newHead);
            if (!eating) {
                this.body.pop();
            }
        }
    }
}

class SnakeTrainer extends Snake {
    neural;
    fitness = 0;
    genes = [];
    food;
    foodLifeTime;

    isAlive = true;
    constructor(initialize) {
        super();
        this.body[0] = {
            x: Math.floor(Math.random() * (TrainingManager.AREA_SIZE - 1) + 1),
            y: Math.floor(Math.random() * (TrainingManager.AREA_SIZE - 1) + 1)
        }
        if (TrainingManager.NEURAL_LAYERS && TrainingManager.LEARNING_RATE) {
            this.neural = new Network(TrainingManager.NEURAL_LAYERS, TrainingManager.LEARNING_RATE);
        }
        this.genes.length = TrainingManager.GENES_SIZE;
        this.foodLifeTime = TrainingManager.AREA_SIZE * 2;
        this.createFood();
        return this;
    }

    createFood(_input) {
        let position;
        if (_input) {
            let validPositions = [];
            for (let i = 0; i < TrainingManager.AREA_SIZE; i++) {
                for (let j = 0; j < TrainingManager.AREA_SIZE; j++) {
                    let index = (i * (TrainingManager.AREA_SIZE - 1)) + j;
                    if (_input[index] == 0) {
                        validPositions.push({ x: i, y: j });
                    }
                }
            }
            let index = Math.floor(Math.random() * (validPositions.length - 1) + 1);
            position = validPositions[index];
        } else {
            position = {
                x: Math.floor(Math.random() * (TrainingManager.AREA_SIZE - 1) + 1),
                y: Math.floor(Math.random() * (TrainingManager.AREA_SIZE - 1) + 1)
            }
        }
        this.food = position;
        this.foodLifeTime = TrainingManager.AREA_SIZE * 2;
    }

    updateFoodLifeTime() {
        this.foodLifeTime--;
        if (this.foodLifeTime <= 0) {
            this.isAlive = false;
            TrainingManager.REMAINING_POPULATION--;
        }
    }

    predict(_input) {
        return this.neural.predict(_input);
    }


    sumFitness(sum) {
        this.fitness = this.fitness + sum;
    }

    updateGenes() {
        this.genes = this.neural.getGenes();
        TrainingManager.GENES_SIZE = this.genes.length;
    }

    updateNeural() {
        this.neural.setGenes(this.genes);
        this.genes = null;
    }

    getFitness() {
        return this.fitness;
    }
}