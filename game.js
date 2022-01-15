///////// Basic contructor design pattern //////////////////////
function Game(id){
    this.id = id;
    this.playerA = null;
    this.playerB = null;
    this.winner = null;
    this.status = "PLAYING";

    this.setWinner = function(winner){
        this.winner = winner;
        this.status = "DONE";
    }
}

module.exports.Game = Game;

