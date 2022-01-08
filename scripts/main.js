let mainCanvas = document.getElementById("mainCanvas");
let context = mainCanvas.getContext("2d");
let boxSize = 32;
let areaSize = 16;
let snake = [];
snake[0] = {
    x: 8 * boxSize,
    y: 8 * boxSize
}

let food = {
    x: Math.floor(Math.random() * (areaSize - 1) + 1) * boxSize,
    y: Math.floor(Math.random() * (areaSize - 1) + 1) * boxSize
}
const left_keymap = 37;
const up_keymap = 38;
const right_keymap = 39;
const down_keymap = 40;

let direction = right_keymap;
let hasNewDirection = true;
function renderBackground() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, areaSize * boxSize, areaSize * boxSize);
}

function renderSnake() {
    for (i = 0; i < snake.length; i++) {
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }
}

function renderFood() {
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, boxSize, boxSize);
}

function createFood() {
    let validPosition = false;
    while (!validPosition) {
        let newFood = {
            x: Math.floor(Math.random() * (areaSize - 1) + 1) * boxSize,
            y: Math.floor(Math.random() * (areaSize - 1) + 1) * boxSize
        }
        validPosition = true;
        for (i = 0; validPosition && i < snake.length; i++) {
            if (snake[i].x == newFood.x && snake[i].y == newFood.y) {
                validPosition = false;
            }
        }
        if (validPosition) {
            food = newFood;
        }
    }
}

function checkColision() {
    if (snake.length > 2) {
        let head = snake[0];
        for (i = 1; i < snake.length; i++) {
            if (snake[i].x == head.x && snake[i].y == head.y) {
                alert("GAME OVER");
                document.location.reload(true);
            }
        }
    }
}

document.addEventListener('keydown', keydownEvent);

function keydownEvent(event) {
    switch (event.keyCode) {
        case right_keymap:
            if (direction != left_keymap && !hasNewDirection) {
                direction = right_keymap;
                hasNewDirection = true;
            }
            break;
        case left_keymap:
            if (direction != right_keymap && !hasNewDirection) {
                direction = left_keymap;
                hasNewDirection = true;
            }
            break;
        case up_keymap:
            if (direction != down_keymap && !hasNewDirection) {
                direction = up_keymap;
                hasNewDirection = true;
            }
            break;
        case down_keymap:
            if (direction != up_keymap && !hasNewDirection) {
                direction = down_keymap;
                hasNewDirection = true;
            }
            break;
    }
}

function updateGame() {
    renderBackground();
    renderSnake();
    renderFood();
    checkColision();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    switch (direction) {
        case right_keymap:
            snakeX += boxSize;
            break;
        case left_keymap:
            snakeX -= boxSize;
            break;
        case up_keymap:
            snakeY -= boxSize
            break;
        case down_keymap:
            snakeY += boxSize;
            break;
    }
    hasNewDirection = false;

    if (snakeX < 0 && direction == left_keymap) {
        snakeX = (areaSize - 1) * boxSize;
    }
    if (snakeX > (areaSize - 1) * boxSize && direction == right_keymap) {
        snakeX = 0;
    }
    if (snakeY < 0 && direction == up_keymap) {
        snakeY = (areaSize - 1) * boxSize;
    }
    if (snakeY > (areaSize - 1) * boxSize && direction == down_keymap) {
        snakeY = 0;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    if (newHead.x == food.x && newHead.y == food.y) {
        createFood();
    } else {
        snake.pop(); //remove last element of array
    }
    snake.unshift(newHead); //add a new element in begin of array
}
setInterval(updateGame, 100);