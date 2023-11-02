let board;
let boardWidth = 500;
let boardHeight = 500;

let context;

//player's bats
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

let player1 = { //object
    x : 10,
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

let player2 = { //object
    x : 10,
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

//ball
let ballWidth = 10;
let ballHeight = 10;

let ball = {
    x : boardWidth/2, //center it horizontally
    y : boardWidth/2, //center it vertically
    velocityX : 1,
    velocityY : 2
};

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //for drawing on the board
    context.fillStyle = "white"; //color of bat
    context.fillRect(player1.x , player1.y , player1.width, player1.height); 
    //player 1 - position and dimensions

}


