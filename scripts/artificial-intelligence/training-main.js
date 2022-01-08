let mainCanvas = document.getElementById("mainCanvas");
let context = mainCanvas.getContext("2d");
let food;
let createNewFood = true;

let board = [[]];

let boxSize = 32;
let parameters = {
    areaSize: 16,
    populationSize: 100,
    percentEliteChromosomes: 0.1,
    percentTournamentSelection: 0.4,
    mutationRate: 0.25,
    neuralLayers: [258, 10, 2],
    learningRate: 0.01
}
let manager = new TrainingManager(parameters);
let food_lifetime = parameters.areaSize * 2;

function restartBoard() {
    board = [];
    board.length = parameters.areaSize;
    for (let i = 0; i < parameters.areaSize; i++) {
        board[i] = [];
        board[i].length = parameters.areaSize;
        for (let j = 0; j < parameters.areaSize; j++) {
            board[i][j] = 0;
        }
    }
}

function renderBackground() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, parameters.areaSize * boxSize, parameters.areaSize * boxSize);
}

function renderSnake(snake) {
    if (snake.length > 0) {
        let head = snake[0];
        if (head.x < 0) {
            head.x = parameters.areaSize - 1;
        }
        if (head.x > parameters.areaSize - 1) {
            head.x = 0;
        }
        if (head.y < 0) {
            head.y = parameters.areaSize - 1;
        }
        if (head.y > parameters.areaSize - 1) {
            head.y = 0;
        }
        snake[0] = head;
    }
    for (i = 0; i < snake.length; i++) {
        let body = snake[i];
        context.fillStyle = "green";
        context.fillRect(body.x * boxSize, body.y * boxSize, boxSize, boxSize);
        board[body.x][body.y] = -1;

    }

    if (snake[0].x == food.x && snake[0].y == food.y) {
        createNewFood = true;
    }
}

function createFood() {
    validPositions = [];
    for (let i = 0; i < parameters.areaSize; i++) {
        for (let j = 0; j < parameters.areaSize; j++) {
            if (board[i][j] == 0) {
                validPositions.push({ x: i, y: j });
            }
        }
    }
    let index = Math.floor(Math.random() * (validPositions.length - 1) + 1);
    let position = validPositions[index];
    food = position;
    createNewFood = false;
}

function renderFood() {
    context.fillStyle = "red";
    context.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

function updateGame() {
    let forceNextGen = false;
    if(food_lifetime <= 0){
        food_lifetime = parameters.areaSize * 2;
        forceNextGen = true;
    }
    restartBoard();
    if (createNewFood) {
        createFood();
    }
    renderBackground();
    renderFood();
    let _input = {
        food: food
    }
    snakes = manager.training(_input,forceNextGen);

    for (let i = 0, size = snakes.length; i < size; i++) {
        renderSnake(snakes[i]);
    }
    food_lifetime--;
}

setInterval(updateGame, 100);