let board;
let boardWidth = 500;
let boardHeight = 500;

let context;

let p1Name = "";
let p2Name = ""; //for player names

let player1Score = 0;
let player2Score = 0;

let isGamePaused = false;

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

    if(p1Name && p2Name){
        document.getElementsByClassName("button-container")[0].style.display = "block";
        //Display buttons
        document.getElementById("startButton").addEventListener("click",startGame);
    }
    


    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //for drawing on the board
    context.fillStyle = "white"; //color of bat
    context.fillRect(player1.x , player1.y , player1.width, player1.height); 
    //player 1 - position and dimensions
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);
    //requestAnimationFrame(update);
    document.addEventListener("keyup", movePlayer);
}

function startGame(){
    requestAnimationFrame(update);
}

document.getElementById("pauseButton").addEventListener("click",pauseGame);

function pauseGame(){
    if(isGamePaused){
        resume();
    }
    else{
        pause();
    }
}

function pause(){
    isGamePaused = true;
    document.getElementById("pauseButton").textContent= "Resume";
    cancelAnimationFrame(update); //stop the game loop
}

function resume(){
    isGamePaused = false;
    document.getElementById("pauseButton").textContent = "Pause";
    update(); //resume the game
}

document.getElementById("restartButton").addEventListener("click",restartGame);

function restartGame(){
    player1Score = 0;
    player2Score = 0;
    player1.y = boardHeight/2;
    player2.y = boardHeight/2;
    resetGame(1); //ball direction

    //winner message
    let resultMessage = document.getElementById("resultMessage");
    resultMessage.textContent = "";
    resultMessage.style.display= "none";

    update(); //restart game loop
}

document.getElementById("endButton").addEventListener("click",endGame);

function endGame(){
    let winner;
    if(player1Score > player2Score){
        winner = p1Name;
    }
    else if(player2Score > player1Score){
        winner = p2Name;
    }
    else{
        winner = "Draw";
    }
    //pause
    pause();

    resetGame(1);

    //displaying the winner name
    let resultMessage = document.getElementById("resultMessage");
    resultMessage.textContent = `Result: ${winner}`;
    resultMessage.style.display = "block"; 
}


function update() {
    if(!isGamePaused)
    requestAnimationFrame(update); //game loop 
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
    context.beginPath(); // Begin the path for drawing the circle
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


        //game over
        if (ball.x < 0) {
            player2Score++;
            resetGame(1);
        }
        else if (ball.x + ballWidth > boardWidth) {
            player1Score++;
            resetGame(-1);
        }
    
        //score
        context.font = "45px sans-serif";
        context.fillText(player1Score, boardWidth/5, 45);
        context.fillText(player2Score, boardWidth*4/5 - 45, 45);
    
        // draw dotted line down the middle
        for (let i = 10; i < board.height; i += 25) { //i = starting y Position, draw a square every 25 pixels down
            // (x position = half of boardWidth (middle) - 10), i = y position, width = 5, height = 5
            context.fillRect(board.width / 2 - 10, i, 5, 5); 
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

function resetGame(direction) {
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : direction,
        velocityY : 2
    }
}
