app.factory('ConfigFactory', function() {
    game.cellSize = game.width / game.cols;
    game.height = (game.rows / game.cols) * game.width;
    var  config = {
        width: 1000,
        rows: 13,
        cols: 20
    };
    config.cellSize =  config.width /  config.cols;
    config.height = (config.rows / config.cols) * config.width;

    return config;
});
