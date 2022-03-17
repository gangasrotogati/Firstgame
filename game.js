// Hello professor! I hope you like our game based on duck hunt. Here's a quick guide:
// Target over a duck and press 'Z' to shoot and kill a duck
// The goal of the game is to kill ten ducks within 30 seconds
// Pressing any key at the end of the game will reset the game

// Here is what we chose to add as our features:
// 1. Add sound effects to the game (not just a background theme, but noises that happen with events).
// 2. Add more random targets to score points (add more sprite images, there are lots of sprites on 
// the web, search, then photo edit the sprite sheet to pick out the images you want to use.)
// 5. Animate the sprite(s) we created the ducks ourselves using a program called Piskel
// 7. Add a time limit where the player loses if they don’t complete something in the time limit.

window.onload = function(){
    const TIMELIMIT = 30 * 1000;
    const MONSTERLIMIT = 10;

    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 800;
    document.body.appendChild(canvas);

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
        bgReady = true;
    };
    bgImage.src = "images/background.jpg";

    //Theme Song
    var themeSound = new Audio();
    var bIsThemePlaying = false;
    themeSound.src = "sounds/theme.wav"
    themeSound.loop = true;

    // Hero image
    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function () {
        heroReady = true;
    };
    heroImage.src = "images/target.png";

    // Monster image
    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function () {
        monsterReady = true;
    };
    monsterImage.src = "images/monster.png";

    // Monster image 2
    var monster2Ready = false;
    var monster2Image = new Image();
    monster2Image.onload = function () {
        monster2Ready = true;
    };
    monster2Image.src = "images/monster2.png";

    // Death image
    var deathReady = false;
    var deathImage = new Image();
    deathImage.onload = function () {
        deathReady = true;
    };
    deathImage.src = "images/death.png";

    // Death image
    var death2Ready = false;
    var death2Image = new Image();
    death2Image.onload = function () {
        death2Ready = true;
    };
    death2Image.src = "images/death2.png";

    // Wall image
    var wallReady = false;
    var wallImage = new Image();
    wallImage.onload = function () {
        wallReady = true;
    };
    wallImage.src = "images/wall.gif";

    //Blast Sound
    var blastSound = new Audio();
    blastSound.src = "sounds/blast.wav";

    //Quack Sound
    var quackSound = new Audio();
    quackSound.src = "sounds/quack.wav";

    // Game objects
    var hero = {
        speed: 256,
        x: canvas.width / 2,
        y: canvas.height / 2,
        bCanFire: true
    };

    let MonsterArray = [];

    MonsterArray.push({speed: 3, color: 0, bIsAlive: false});
    MonsterArray.push({speed: 3, color: 1, bIsAlive: false});

    var monstersRemaining = MONSTERLIMIT;

    let deadDucks = [];

    let WallArray = [];

    for(let i = 0; i < 32 % canvas.width; i++){
        WallArray.push({x:i * 32, y: 0})
        WallArray.push({x:i * 32, y: canvas.height - 32})
    }
    for(let i = 0; i < 32 % canvas.height; i++){
        WallArray.push({x:0, y: i * 32})
        WallArray.push({x:canvas.width - 32, y: i * 32})
    }

    //Timer Variables
    let previousTime = new Date();

    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        //Now the user has interactred with the document so we can play a theme
        if(bIsThemePlaying == false){
            themeSound.play();
            bIsThemePlaying = true;
        }
        if(bIsGameOver == true){
            restartGame()
        }
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);
    
    // Reset the game when the player catches a monster
    var reset = function () {
        // Throw the monster somewhere on the screen randomly
        MonsterArray.forEach(element => {
            if(element.bIsAlive == false && bIsGameOver == false){
                element.x = -128;
                element.y = 128 + (Math.random() * (canvas.height - 256));
                element.bIsAlive = true;
                element.speed = Math.random() * 5 + 1
            }
        });
    };

    //End the Game
    var bIsGameOver = false;
    var gameOver = function () {
        if(bIsGameOver == false){
            bIsGameOver = true;

            MonsterArray.length = 0;
        }
    }

    //Reset the game
    let restartGame = function () {
        bIsGameOver = false;
        timeRemaining = TIMELIMIT;
        monstersRemaining = MONSTERLIMIT;
        MonsterArray.push({speed: 3, color: 0, bIsAlive: false});
        MonsterArray.push({speed: 3, color: 1, bIsAlive: false});
        reset();
    }

    //Run the timer
    timeRemaining = TIMELIMIT;
    let runTimer = function () {
        let currentTime = new Date();
        if(currentTime - previousTime > 1000){
            timeRemaining -= currentTime - previousTime;
            previousTime = currentTime;
        }
        if(timeRemaining < 0){
            gameOver();
        }
    }


    // Update game objects
    var update = function (modifier) {
        if (38 in keysDown) { // Player holding up
            if(hero.y > 32){
                hero.y -= hero.speed * modifier;
            }
        }
        if (40 in keysDown) { // Player holding down
            if(hero.y < canvas.height - 96){
                hero.y += hero.speed * modifier;
            }
        }
        if (37 in keysDown) { // Player holding left
            if(hero.x > 32){
                hero.x -= hero.speed * modifier;
            }
        }
        if (39 in keysDown) { // Player holding right
            if(hero.x < canvas.width - 96){
                hero.x += hero.speed * modifier;   
            }
        }
        if (90 in keysDown) { // Player holding z
            if(hero.bCanFire == true){
                console.log("blam"); 
                blastSound.play();
                hero.bCanFire = false;
            }
        }
        if (!(90 in keysDown)) { // Player holding z
            hero.bCanFire = true;
        }

        //move monsters
        MonsterArray.forEach(element => {
            element.x += element.speed;
            if (element.x > canvas.width + 20){
                element.bIsAlive = false;
                reset();
            }
        });

        // Are they touching?
        MonsterArray.forEach(element => {
            if (
                hero.x <= (element.x + 64)
                && element.x <= (hero.x + 64)
                && hero.y <= (element.y + 64)
                && element.y <= (hero.y + 64)
                && hero.bCanFire == false
            ) {
                element.bIsAlive = false;
                --monstersRemaining;
                deadDucks.push({x: element.x, y: element.y, color: element.color});
                if(monstersRemaining <= 0){
                    gameOver();
                }
                quackSound.play();
                reset();
            }
        });
    };

    // Draw everything
    var frame = 0;
    var render = function () {
        frame += 1;
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }

        if (heroReady) {
            ctx.drawImage(heroImage, hero.x, hero.y);
        }

        deadDucks.forEach(element => {

            element.y += 6;
            if(element.color == 0){
                if (deathReady) {
                    if(frame % 24 < 12){
                        ctx.drawImage(deathImage, 0, 0, 128, 128, element.x, element.y, 128, 128);
                    }
                    else if(frame % 24 >= 12){
                        ctx.drawImage(deathImage, 0, 128, 128, 128, element.x, element.y, 128, 128);
                    }
                }
            }
            else {
                if (death2Ready) {
                    if(frame % 24 < 12){
                        ctx.drawImage(death2Image, 0, 0, 128, 128, element.x, element.y, 128, 128);
                    }
                    else if(frame % 24 >= 12){
                        ctx.drawImage(death2Image, 0, 128, 128, 128, element.x, element.y, 128, 128);
                    }
                }
            }

            if(element.y > canvas.height){
                delete deadDucks[element];
            }
        });

        MonsterArray.forEach(element => {

            if(element.color == 0){
                if (monsterReady) {
                    if(frame % 50 < 25){
                        ctx.drawImage(monsterImage, 0, 0, 128, 128, element.x, element.y, 128, 128);
                    }
                    else if(frame % 50 >= 25){
                        ctx.drawImage(monsterImage, 0, 128, 128, 128, element.x, element.y, 128, 128);
                    }
                } 
            } 
            else {
                if (monsterReady) {
                    if(frame % 50 < 25){
                        ctx.drawImage(monster2Image, 0, 0, 128, 128, element.x, element.y, 128, 128);
                    }
                    else if(frame % 50 >= 25){
                        ctx.drawImage(monster2Image, 0, 128, 128, 128, element.x, element.y, 128, 128);
                    }
                } 
            }
        });
        if (wallReady){
            WallArray.forEach(element => {
                ctx.drawImage(wallImage, element.x, element.y);
            });
        }

        
        runTimer();
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        if(bIsGameOver){
            ctx.fillText("", 32, 32);
        }
        else{
            ctx.fillText("Time Remaining: " + Math.floor(timeRemaining / 1000), 32, 32);
        }

        // Score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        if(bIsGameOver){
            if(timeRemaining < 0){
                ctx.fillText("GAME OVER!", 300, 375);
                ctx.fillText("Press any key to play again", 300, 439);
            } else{
                ctx.fillText("YOU WIN!", 375, 375);
                ctx.fillText("Press any key to play again", 300, 439);
            }
        }
        else{
            ctx.fillText("Ducks Remaining: " + monstersRemaining, 32, 64);
        }
    };

    // The main game loop
    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;

        // Request to do this again ASAP
        requestAnimationFrame(main);
    };

    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Let's play this game!
    var then = Date.now();
    reset();
    main();
}