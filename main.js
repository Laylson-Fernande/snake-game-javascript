let mainCanvas = document.getElementById("mainCanvas");
let context = mainCanvas.getContext("2d");
let boxSize = 32;
let areaSize = 16;
let snake = [];
snake[0] = {
    x: 8 * boxSize,
    y: 8 * boxSize
}
const left_keymap = 37;
const up_keymap = 38;
const right_keymap = 39;
const down_keymap = 40;

let direction = right_keymap;
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

document.addEventListener('keydown', keydownEvent);

function keydownEvent(event) {
    switch (event.keyCode) {
        case right_keymap:
            if (direction != left_keymap) {
                direction = right_keymap;
            }
            break;
        case left_keymap:
            if (direction != right_keymap) {
                direction = left_keymap;
            }
            break;
        case up_keymap:
            if (direction != down_keymap) {
                direction = up_keymap;
            }
            break;
        case down_keymap:
            if (direction != up_keymap) {
                direction = down_keymap;
            }
            break;
    }
}

function updateGame() {
    renderBackground();
    renderSnake();

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
    if (snakeX < 0 && direction == left_keymap) {
        snakeX = (areaSize-1) * boxSize;
    }
    if (snakeX > (areaSize-1) * boxSize && direction == right_keymap) {
        snakeX = 0;
    }
    if (snakeY < 0 && direction == up_keymap) {
        snakeY = (areaSize-1) * boxSize;
    }
    if (snakeY > (areaSize-1) * boxSize && direction == down_keymap) {
        snakeY = 0;
    }

    snake.pop(); //remove last element of array

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead); //add a new element in begin of array
}
setInterval(updateGame, 100);