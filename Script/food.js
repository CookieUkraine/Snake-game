export function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export let foodImage = new Image();
// export function randomFood() {
//     if(getRandomIntInclusive(1, 2) === 1) {
//         foodImage.src = foodSkin.apple;
//     } else {
//         foodImage.src = foodSkin.grape;
//     }
// }
export let food = {
        x: 200,
        y: 200
    }
    //helper 
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
export function generateFood(snake, victorySound, gameOver) {
        let field = [];
        for (let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                field.push({x: i * 50, y: j * 50});
            }
        }
    
        let fields = field.filter(item => !snake.find(body => item.x === body.x && item.y === body.y))
        if(fields.length < 1) {
            victorySound.play();
            gameOver("Victory");
            return;
        }
        food = fields[getRandomInt(fields.length)];
}
