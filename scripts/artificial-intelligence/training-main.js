let mainCanvas = document.getElementById("mainCanvas");
let context = mainCanvas.getContext("2d");
let maxSnakeRender = 1;
let boxSize = 32;
let parameters = {
    areaSize: 16,
    populationSize: 500,
    percentEliteChromosomes: 0.1,
    percentTournamentSelection: 0.40,
    mutationRate: 0.05,
    neuralLayers: [1, 10, 2],
    learningRate: 0.01
}
let manager = new TrainingManager(parameters);
let food_lifetime = parameters.areaSize * 2;

let render = true;

function renderBackground() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, parameters.areaSize * boxSize, parameters.areaSize * boxSize);
}

function renderSnake(snake) {
    let body = snake.body;
    for (i = 0; i < body.length; i++) {
        let position = body[i];
        context.fillStyle = "green";
        context.fillRect(position.x * boxSize, position.y * boxSize, boxSize, boxSize);

    }

    if (snake.food) {
        context.fillStyle = "red";
        context.fillRect(snake.food.x * boxSize, snake.food.y * boxSize, boxSize, boxSize);
    }
}

function updateGame() {
    renderBackground();

    let forceNextGen = false;
    if (food_lifetime <= 0) {
        food_lifetime = parameters.areaSize * 2;
        forceNextGen = true;
    }
    let _input = {
        forceNextGen: forceNextGen
    }
    snakes = manager.training(_input);

    for (let i = 0, size = snakes.length; i < maxSnakeRender && i < size; i++) {
        renderSnake(snakes[i]);
    }
    food_lifetime--;
}

setInterval(updateGame, 100);