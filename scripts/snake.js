class Snake {
    body = [];
    direction = {
        x: 1,
        y: 0
    }

    turnRight() {
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

    updateBody(eating) {
        let head = this.body[0];
        let newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        }
        this.body.unshift(newHead);
        if (!eating) {
            this.body.pop();
        }
    }
}

class SnakeTrainer extends Snake {
    neural;
    fitness = 0;
    genes = [];

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
        return this;
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

    updateNeural(){
        this.neural.setGenes(this.genes);
        this.genes = null;
    }

    getFitness() {
        return this.fitness;
    }
}