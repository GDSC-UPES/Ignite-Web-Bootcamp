let board;
let boardWidth = 500;
let boardHeight = 500;

let context;

let p1Name = "";
let p2Name = ""; //for player names

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

let player2 = {
    x : boardWidth - playerWidth - 10,
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
    y : boardHeight/2, //center it vertically
    width: ballWidth,
    height: ballHeight,
    velocityX : 1,
    velocityY : 2
}



window.onload = function() {
    if(!p1Name && !p2Name){
        p1Name = prompt("Enter name of first player:","Player1");
        p2Name = prompt("Enter name of first player:","Player2");
        p1.innerHTML = "Challenger 1 ~ <strong> " + p1Name + "</strong>";
        p2.innerHTML = "Challenger 2 ~ <strong> " + p2Name + "</strong>";
    }
    
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //for drawing on the board
    context.fillStyle = "white"; //color of bat
    context.fillRect(player1.x , player1.y , player1.width, player1.height); 
    //player 1 - position and dimensions

    requestAnimationFrame(update);
    document.addEventListener("keyup", movePlayer);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // player1
    context.fillStyle = "white";
    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    // player1.y += player1.velocityY;
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

    // player2
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
    // player2.y += player2.velocityY;
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);

    // ball
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

    //if ball touches top/bottom of canvas
    if(ball.y<=0 || (ball.y + ballHeight >= boardHeight))
    {
        ball.velocityY *= -1 ; //reverse direction
    }

    if(detectCollision(ball,player1)){
        if(ball.x <= player1.x + player1.width)
        //left side of ball touches right side of player 1
        {
            ball.velocityX *= -1;
        }
    }

    else if(detectCollision(ball,player2)){
        if(ball.x + ballWidth >= player2.x)
        //right side of ball touches left side of player 2
        {
            ball.velocityX *= -1;
        }
    }

    
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}

function movePlayer(e) {
    //player1
    if (e.code == "KeyW") {
        player1.velocityY = -3;
    }
    else if (e.code == "KeyS") {
        player1.velocityY = 3;
    }

    //player2
    if (e.code == "ArrowUp") {
        player2.velocityY = -3;
    }
    else if (e.code == "ArrowDown") {
        player2.velocityY = 3;
    }
}

function detectCollision(a,b){ // to detect collisions/intersections b/w ball & bat
    return a.x < b.x + b.width && 
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}


