class Snake {
    body = [];
    direction = {
        x: 1,
        y: 0
    }
    history = [];
    numberChangesDirection = 0;
    turnRight() {
        this.history.push("turnRight");
        this.numberChangesDirection++;
        this.direction = SnakeTrainer.turnDirection(this.direction, true);
    }

    turnLeft() {
        this.history.push("turnLeft");
        this.numberChangesDirection++;
        this.direction = SnakeTrainer.turnDirection(this.direction, false);
    }

    static turnDirection(direction, right) {
        let newDirection = {
            x: direction.x,
            y: direction.y
        }
        if (right) {
            if (direction.x == 1) {
                newDirection = {
                    x: 0,
                    y: -1
                }
            } else if (direction.x - 1) {
                newDirection = {
                    x: 0,
                    y: 1
                }
            } else if (direction.y == 1) {
                newDirection = {
                    x: 1,
                    y: 0
                }
            } else if (direction.y == -1) {
                newDirection = {
                    x: -1,
                    y: 0
                }
            }
        } else {
            if (direction.x == 1) {
                newDirection = {
                    x: 0,
                    y: 1
                }
            } else if (direction.x - 1) {
                newDirection = {
                    x: 0,
                    y: -1
                }
            } else if (direction.y == 1) {
                newDirection = {
                    x: -1,
                    y: 0
                }
            } else if (direction.y == -1) {
                newDirection = {
                    x: 1,
                    y: 0
                }
            }

        }
        return newDirection;
    }

    updateBody(eating, _areaSize) {
        if (this.body.length > 0) {
            let head = this.body[0];
            let newHead = {
                x: head.x + this.direction.x,
                y: head.y + this.direction.y
            }
            if (newHead.x < 0) {
                this.isAlive = false;
                TrainingManager.REMAINING_POPULATION--;
            }
            if (newHead.x > parameters.areaSize - 1) {
                this.isAlive = false;
                TrainingManager.REMAINING_POPULATION--;
            }
            if (newHead.y < 0) {
                this.isAlive = false;
                TrainingManager.REMAINING_POPULATION--;
            }
            if (newHead.y > parameters.areaSize - 1) {
                this.isAlive = false;
                TrainingManager.REMAINING_POPULATION--;
            }
            for (let i = 1; this.isAlive && i < this.body.length; i++) {
                let position = this.body[i];
                if (position.x == newHead.x && position.y == newHead.y) {
                    this.isAlive = false;
                }
            }
            this.body.unshift(newHead);
            this.body.pop();
            if (!eating) {

            } else {
                this.history.push("eat a food");
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
    constructor() {
        super();
        this.body[0] = {
            x: 0,
            y: 0
        }
        let newHead = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        }
        this.body.unshift(newHead);
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
        this.foodLifeTime = TrainingManager.AREA_SIZE * TrainingManager.AREA_SIZE;
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