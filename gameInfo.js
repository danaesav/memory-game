const game = function(gameId){
    this.playerA = null;
    this.playerB = null;
    this.id = gameId;
    this.gameState = null;
}

module.exports = game;