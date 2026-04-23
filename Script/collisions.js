export function checkCollisionWithFood(snake, food) {
        return snake[0].x === food.x && snake[0].y === food.y;
    }
export function checkCollisionWithFieldArea(snake) {
    return snake[0].x < 0 || snake[0].x > 450 || snake[0].y < 0 || snake[0].y > 450;
}
export function checkCollisionWithBody(snake) {
    return snake.find((item, index) => index !== 0 && item.x === snake[0].x && item.y === snake[0].y)
}