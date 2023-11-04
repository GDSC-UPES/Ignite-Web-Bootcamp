//board

const collisionSound = new Audio("assets/move.mp3");
const TouchSound = new Audio("assets/balltouch.mp3");
const MissSound = new Audio("assets/miss.mp3");

let board;


let boardWidth = 500;
let boardHeight = 500;
let context; 

//players (bats' variables for the ball)
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;  //to make bats move up nd down; only velocityY needed bcoz paddle can go up nd down

let p1Name = ""; //for names of Player 1 and 2
let p2Name = "";

let player1 = {  //object
    x : 10,
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

let player2 = {
    x : boardWidth - playerWidth - 10, //initial 10 used up by prev player
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

let isGamePaused = false;

//ball
let ballWidth = 10;
let ballHeight = 10;


let ball = {
    x: boardWidth / 2, // Center it horizontally
    y: boardHeight / 2, // Center it vertically
    
    velocityX: 1,
    velocityY: 2
};

let player1Score = 0;
let player2Score = 0;


window.onload = function() {
    if (!p1Name && !p2Name) { //names of Players
        p1Name = prompt("Enter name of first player:", "Player1");
        p2Name = prompt("Enter name of second player:", "Player2");
        p1.innerHTML = "Challenger 1 ~ <strong>" + p1Name + "</strong>";
        p2.innerHTML = "Challenger 2 ~ <strong>" + p2Name + "</strong>";
    }

    if (p1Name && p2Name) {
        document.getElementsByClassName("button-container")[0].style.display = "block"; // Display buttons
        document.getElementById("startButton").addEventListener("click", startGame);
    }
    
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

     //draw initial player1
     context.fillStyle="white";  //fill color of bat as blue
     context.fillRect(player1.x, player1.y, playerWidth, playerHeight); //FOR PLAYER 1 only : make the bat as a rect
     // x y coordinates for position and dimensions for height width of bat
     context.fillRect(player2.x, player2.y, playerWidth, playerHeight); //FOR PLAYER 2

      //func to update positions of bat, when it goes up y coordinates - and vice versa
     document.addEventListener("keyup", movePlayer);
}

function startGame(){
    requestAnimationFrame(update);
}

document.getElementById("pauseButton").addEventListener("click", pauseGame);
function pauseGame() {
    if (isGamePaused) {
        resume();
    } else {
        pause();
    }
}

function pause() {
    isGamePaused = true;
    document.getElementById("pauseButton").textContent = "Resume";
    cancelAnimationFrame(update); // Stop the game loop.
}

function resume() {
    isGamePaused = false;
    document.getElementById("pauseButton").textContent = "Pause";
    update(); // Resume the game by calling the update function.
}

document.getElementById("restartButton").addEventListener("click", restartGame);

function restartGame() {
    player1Score = 0;
    player2Score = 0;
    player1.y = boardHeight / 2;
    player2.y = boardHeight / 2;
    resetGame(1); // Pass the direction for ball movement after restarting.
    
    // Clear the winner message
    let resultMessage = document.getElementById("resultMessage");
    resultMessage.textContent = "";
    resultMessage.style.display = "none";
    
    update(); // Restart the game by calling the update function.
}


document.getElementById("endButton").addEventListener("click", endGame);

function endGame() {
    let winner;
    if (player1Score > player2Score) {
        winner = p1Name;
    } else if (player2Score > player1Score) {
        winner = p2Name;
    } else {
        winner = "Draw";
    }
    
    // Pause the game
    pause();
    
    // Reset the game state
    resetGame(1);
    
    // Display the winner's name on the webpage
    let resultMessage = document.getElementById("resultMessage");
    resultMessage.textContent = `Result: ${winner}`;
    resultMessage.style.display = "block"; // Show the result message
}


function update(){
    if(!isGamePaused)
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    //player1
    context.fillStyle="white";  //fill color of bat as blue

    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);



    //player2 - make bat for 2nd player
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

     if (ball.y <= 0 || (ball.y + ballHeight >= boardHeight)) {  // if ball touches top or bottom of canvas
        collisionSound.play();
        ball.velocityY *= -1; //reverse Y direction
    }


        //bounce the ball back
        if (detectCollision(ball, player1)) {
            if (ball.x <= player1.x + player1.width) { //left side of ball touches right side of player 1 (left paddle)
                TouchSound.play();
                ball.velocityX *= -1;   // flip x direction
            }
        }
        else if (detectCollision(ball, player2)) {
            if (ball.x + ballWidth >= player2.x) { //right side of ball touches left side of player 2 (right paddle)
                TouchSound.play();
                ball.velocityX *= -1;   // flip x direction
            }
        } 

         //game over
        if (ball.x < 0) { //x position is past left side of canvas, meaning player 2 hit
            MissSound.play();
            player2Score++;
            resetGame(1);
          }
        else if (ball.x + ballWidth > boardWidth) {   //right side of ball passes board width
            MissSound.play();
            player1Score++;
            resetGame(-1);
    }

    //score
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);  //x coordinate is 1/5th , y coordinate 45
    context.fillText(player2Score, boardWidth*4/5 - 45, 45);  //x coordinate 4/5th and -45 to set it from right


    // draw dotted line down the middle for visuals
    for (let i = 10; i < board.height; i += 25) { //i = starting y Position, draw a square every 25 pixels down
        // (x position = half of boardWidth (middle) - 10), i = y position, width = 5, height = 5
        context.fillRect(board.width / 2 - 10, i, 5, 5);   
    }
}


function outOfBounds(yPosition) {  //func to check bounds so paddle doesnt cross the screen
    //returns true or false
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}


function movePlayer(e) {
    //player1
    

    if (e.code == "KeyW") {  //up means y coordinate decreasing for a board that starts from 0/1
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


function detectCollision(a, b) { //ball hits any of the paddle
    //intersection of 2 rectangles
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner 
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function resetGame(direction) {  //update scoring
    ball = {  //updating ball object
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : direction,
        velocityY : 2
    }
}