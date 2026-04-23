

let renderScene = null;
let isAlive = true;
import { snake, moveSnake, directions, DIRECTIONS} from "./snake.js";
import { foodImage, food, generateFood} from "./food.js";
import { checkCollisionWithFood, checkCollisionWithFieldArea, checkCollisionWithBody} from "./collisions.js";

const startButton = document.getElementById('startButton');
const appleSkinButton = document.getElementById('appleSkin');
const grapeSkinButton = document.getElementById('grapeSkin');
const lemonSkinButton = document.getElementById('lemonSkin');

appleSkinButton.style.border = "2px solid #ccc";
let foodSkin = './Images/Apple.png';

appleSkinButton.addEventListener('click', () => {
    foodSkin = './Images/Apple.png';
    appleSkinButton.style.border = "2px solid #ccc";
    grapeSkinButton.style.border = "0px solid #ccc";
    lemonSkinButton.style.border = "0px solid #ccc";
});

grapeSkinButton.addEventListener('click', () => {
    foodSkin = './Images/Grape.png';
    grapeSkinButton.style.border = "2px solid #ccc";
    appleSkinButton.style.border = "0px solid #ccc";
    lemonSkinButton.style.border = "0px solid #ccc";
});

lemonSkinButton.addEventListener('click', () => {
    foodSkin = './Images/Lemon.png';
    lemonSkinButton.style.border = "2px solid #ccc";
    appleSkinButton.style.border = "0px solid #ccc";
    grapeSkinButton.style.border = "0px solid #ccc";
});
let turnSounds = [
            new Audio('Sounds/turn UP.mp3'),
            new Audio('Sounds/turn RIGHT.mp3'),
            new Audio('Sounds/turn DOWN.mp3'),
            new Audio('Sounds/turn LEFT.mp3')
        ];
let eatingSound = new Audio();
eatingSound.src = 'Sounds/Eating.mp3';
let victorySound = new Audio();
victorySound.src = 'Sounds/Victory.mp3';
let defeatSound = new Audio();
defeatSound.src = 'Sounds/Defeat.mp3';

startButton.addEventListener('click', () => {
    document.querySelector('.container').style.display = "block";
    document.querySelector('.controls').style.display = "block";
    init();
    document.querySelector('.menu').style.display = "none";
});

const init = function() {
    const canvas = document.getElementById('view');
    const ctx = canvas.getContext('2d');
    function drawBackground() {
        let rows = 10;
        let cols = 10;
        let cellSize = 50;

        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if ((row + col) % 2 === 0) {
                    ctx.fillStyle = "rgb(170, 215, 81)";
                } else {
                    ctx.fillStyle = "rgb(200, 235, 120)";
                }
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
    
    
    
    

    let highScore = 0;
    // [top = 0, right = 1, down = 2, left = 3]
    function drawRectangle(x, y, color) {
        ctx.beginPath();
        ctx.rect(x, y, 50, 50);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
    function resetGame() {
    snake.length = 3;
    snake[0] = { x: 100, y: 0, direction: DIRECTIONS.RIGHT };
    snake[1] = { x: 50, y: 0, direction: DIRECTIONS.RIGHT };
    snake[2] = { x: 0, y: 0, direction: DIRECTIONS.RIGHT };
    isAlive = true;
    generateFood(snake, victorySound, gameOver);
}
    function drawSnake() {
        //індекс 0 найяскравіший, тіло поступово темнішає
        snake.forEach((item, i) => {
            const green = Math.max(30, 200 - i * 6); // підкоригуйте множник для потрібної інтенсивності
            drawRectangle(item.x, item.y, `rgb(0, ${green}, 0)`);
        });
    }
    let gameOverCheck = false;  

    function drawFood() {
        // randomFood();
        foodImage.src = foodSkin;
        ctx.drawImage(foodImage, food.x, food.y, 50, 50);
    }

    function checkCorrectDirection(directionIndex) {
        if(
            snake[0].x + directions[directionIndex].dx !== snake[1].x && 
            snake[0].y + directions[directionIndex].dy !== snake[1].y
        ) {
            return true
        }
        return false
    }
    function keyDownHandle(e) {
        //top
        if(e.code === 'KeyW' && snake[0].direction !== DIRECTIONS.DOWN && checkCorrectDirection(DIRECTIONS.TOP)) {
            if(isAlive && snake[0].direction !== DIRECTIONS.TOP && checkCorrectDirection(DIRECTIONS.TOP)) {
                turnSounds[0].play();
            }
            snake[0].direction = DIRECTIONS.TOP;
            
        }
        else if(e.code === 'KeyD' && snake[0].direction !== DIRECTIONS.LEFT && checkCorrectDirection(DIRECTIONS.RIGHT)) {
            if(isAlive && snake[0].direction !== DIRECTIONS.RIGHT&& checkCorrectDirection(DIRECTIONS.RIGHT)) {
                turnSounds[1].play();
            }
            snake[0].direction = DIRECTIONS.RIGHT;
        }
        else if(e.code === 'KeyS' && snake[0].direction !== DIRECTIONS.TOP && checkCorrectDirection(DIRECTIONS.DOWN)) {
            if(isAlive && snake[0].direction !== DIRECTIONS.DOWN && checkCorrectDirection(DIRECTIONS.DOWN)) {
                turnSounds[2].play();
            }
            snake[0].direction = DIRECTIONS.DOWN;
        }
        else if(e.code === 'KeyA' && snake[0].direction !== DIRECTIONS.RIGHT && checkCorrectDirection(DIRECTIONS.LEFT)) {
            if(isAlive && snake[0].direction !== DIRECTIONS.LEFT && checkCorrectDirection(DIRECTIONS.LEFT)) {
                turnSounds[3].play();
            }
            snake[0].direction = DIRECTIONS.LEFT;
        }
    }
    
    document.addEventListener('keydown', keyDownHandle, true);
    document.addEventListener('keydown', restart, true);

    function gameLoop() {
        let snakeTail = JSON.parse(JSON.stringify(snake[snake.length - 1]));
        moveSnake();
        
        if(checkCollisionWithBody(snake) || checkCollisionWithFieldArea(snake)) {
            clearInterval(renderScene);
            gameOver("Defeat");
            defeatSound.play();
            return;
        }
        if(checkCollisionWithFood(snake, food)) {
            snake.push(snakeTail);
            generateFood(snake, victorySound, gameOver);
            setTimeout(() => {
                document.querySelector('.container > h1:nth-child(2)').innerText = `Score: ${snake.length - 3}`;
                highScore = Math.max(highScore, snake.length - 3, localStorage.getItem('highScore'));
                localStorage.setItem('highScore', highScore);
                document.querySelector('.container > h1:nth-child(3)').innerText = `High score: ${highScore}`;
                eatingSound.play();
            }, 200);
        }
    }
    function gameOver(winText) {
        isAlive = false;
        ctx.fillStyle = "white";
        ctx.font = "bold 30px Arial";
        ctx.fillText(winText, canvas.width / 2 - 40, canvas.height / 2 - 60);
        ctx.fillText("Press R to Restart", canvas.width / 2 - 120, canvas.height / 2 - 20);
        gameOverCheck = true;
    }
    function restart(e) {
        if(gameOverCheck && e.code === 'KeyR') {
            resetGame();

            init();
            document.querySelector('.container > h1:nth-child(2)').innerText = `Score: `;
        }
        else {
            return;
        }
        gameOverCheck = false;
    }
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground()
        drawSnake();
        drawFood();
        gameLoop();
    }
    if (renderScene) {
        clearInterval(renderScene);
    }
    renderScene = setInterval(render, 200);
}


