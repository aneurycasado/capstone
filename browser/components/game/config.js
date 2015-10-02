let game = {
    width: 1000,

    rows: 13,
    cols: 20,
};

game.cellSize = game.width / game.cols;
console.log('game.cellSize', game.cellSize);
game.height = (game.rows / game.cols) * game.width;

module.exports = game;