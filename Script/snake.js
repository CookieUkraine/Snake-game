//Constants
export let DIRECTIONS = {
    TOP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}
export let directions = [
        { 
            dx: 0,
            dy: -50
        }, // TOP
        { 
            dx: 50,
            dy: 0
        }, // RIGHT
        { 
            dx: 0,
            dy: 50
        }, // DOWN
        { 
            dx: -50,
            dy: 0
        } // LEFT
    ]
export let snake = [
        { x: 100, y: 0, direction: DIRECTIONS.RIGHT },
        { x: 50, y: 0, direction: DIRECTIONS.RIGHT },
        { x: 0, y: 0, direction: DIRECTIONS.RIGHT }
    ]
export function moveSnake() {
        let newDirection = null;
        snake.forEach(item => {
            item.x += directions[item.direction].dx;
            item.y += directions[item.direction].dy;

            if(newDirection != null) {
                let bufferDirection = item.direction;
                item.direction = newDirection;
                newDirection = bufferDirection;
            } else {
                newDirection = item.direction;
            }
        });
    }
