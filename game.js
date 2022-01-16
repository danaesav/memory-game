///////// Basic contructor design pattern //////////////////////
function Game(playerA, playerB){
    this.playerA = playerA;
    this.playerB = playerB;
    this.status = "PLAYING";

    this.setDone = function(){
        this.status = "DONE";
    }
}

module.exports.Game = Game;

