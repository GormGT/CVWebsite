console.log("Looking for errors? Or are you trying to cheat?");


//Create variables with the necessary HTML components
let shotgun = document.querySelectorAll("img");
let target = document.querySelectorAll("button");
let updateText = document.querySelector("h3#mainDesc");
let scoreCounters = document.querySelector("div.counters");
let point = document.querySelector("p.scoreCounter");
let health = document.querySelector("p.healthCounter");
let middlePage = document.querySelector("div.gallery");
let background = document.querySelector("body");

//Create a variable that stores the default background (or background color)
var backgroundColor = getComputedStyle(background);
var defaultBackground = backgroundColor.backgroundColor;


//Declare all the sounds as variables and adjust their volume
var shotgunSound = new Audio("sounds/dsshotgn.wav");
var backMusic = new Audio("sounds/d-e1m4.mp3");
var playerHurt = new Audio("sounds/dsplpain.wav");
var playerDeath = new Audio("sounds/dspldeth.wav");
var zombieShoot = new Audio("sounds/dspistol.wav");

var zombieDeathSounds = {
    death1 : new Audio("sounds/dspodth1.wav"),
    death2 : new Audio("sounds/dspodth2.wav"),
    death3 : new Audio("sounds/dspodth3.wav")
};

var zombieSpawnSounds = {
    spawn1 : new Audio("sounds/dsposit1.wav"),
    spawn2 : new Audio("sounds/dsposit2.wav"),
    spawn3 : new Audio("sounds/dsposit3.wav")
};

var deathSoundsValue = Object.values(zombieDeathSounds);
var spawnSoundsValue = Object.values(zombieSpawnSounds);


shotgunSound.volume = 0.5;
backMusic.volume = 1;
playerHurt.volume = 0.5;
zombieShoot.volume = 0.4;

zombieDeathSounds.death1.volume = 0.2;
zombieDeathSounds.death2.volume = 0.2;
zombieDeathSounds.death3.volume = 0.2;

zombieSpawnSounds.spawn1.volume = 0.3;
zombieSpawnSounds.spawn2.volume = 0.3;
zombieSpawnSounds.spawn3.volume = 0.3;

backMusic.loop = true;

//Reduce the amount of lines required for playing a sound
function playSound(sound){
    sound.load();
    sound.play();
};


//Start the game by pressing the description text
function startGame(){
    updateText.innerHTML = "Shoot the targets to earn points.";
    updateText.removeAttribute("onclick");
    playSound(backMusic);
    for(let i = 0; i <= target.length; i++){;
        target[i].style.backgroundImage = 'url("images/ZombieNormal.png")';
        target[i].setAttribute("onclick", "shoot(" + i + ")");
    };
    /*The for loop must be the last command to get executed, because for some reason anything
    that is written below it gets ignored.*/
};


//Variables that get redefined as the program runs
var shotCheck = false;
var deathCheck = false;
var spawnSound;

//Stores the players points when the game ends
var pointSave = "";

//The timeout ID for respawning a zombie
var zombieRespawn;

function respawnZombie (targetNumber, time){
    zombieRespawn = setTimeout(function(){
        target[targetNumber].style.backgroundImage = 'url("images/ZombieNormal.png")';
        target[targetNumber].setAttribute("onclick", "shoot(" + targetNumber + ")");
        shotCheck = false;
        reduceHealth();
        playSound(spawnSound);
        pointCheckIDs[targetNumber] = true;
        setTimeout(function(){
            pointCheckIDs[targetNumber] = false;
        }, 850);
    }, time);
}


//Create an array that contains uniqe booleans for each target. This is for the dynamic points system
var pointCheckIDs = [];

for (let i = 0; i < target.length; i++){
    var pc = false;
    pointCheckIDs.push(pc);
}

//Starts the damage countdown when a zombie respawns and can damage the player, end the game, or cancel the countdown depending on player input
function reduceHealth (){
    var healthTimer = 5;
    var healthDecrease = setInterval(function(){
        healthTimer--;

        if (healthTimer <= 0 && deathCheck == false){
            //Generate a random number to determine the amount of damage a zombie is supposed to do
            var damage = Math.floor(Math.random() * 25) + 10;
            health.innerHTML = health.innerHTML - damage;
            playSound(zombieShoot);

            //Flash the background color to dark red when the player takes damage
            background.style.backgroundColor = "darkred";
            setTimeout(function(){
                background.style.backgroundColor = defaultBackground;
            }, 100);

            playSound(playerHurt);
            clearInterval(healthDecrease);

            //End the game once the player's health goes below zero
            if (health.innerHTML <= 0 && deathCheck == false){
                pointSave = point.innerHTML;
                shotgun[0].remove();
                scoreCounters.remove();
                shotCheck = true;
                updateText.innerHTML = "Game over";
                addHTMLelement( "p", "You died!", middlePage);
                addHTMLelement("p", "Points: " + pointSave, middlePage);
                addHTMLelement("p", "Refresh the page to try again.", middlePage);
                deathCheck = true;
                zombieSpawnSounds.spawn1.volume = 0.0;
                zombieSpawnSounds.spawn2.volume = 0.0;
                zombieSpawnSounds.spawn3.volume = 0.0;
                zombieShoot.volume = 0.0;
                playerHurt.volume = 0.0;
                playSound(playerDeath);
                for (let i = 0; i <= target.length; i++){
                    clearTimeout(zombieRespawn);
                    target[i].style.backgroundImage = 'none';
                    target[i].removeAttribute("onclick");
                    clearInterval(healthDecrease);
                    target[i].remove();
                };
                return;
                //Similarly to the startgame() function, the for loop has to be the last command to get executed


            };

        }
        else if (shotCheck == true){
            clearInterval(healthDecrease);
        }
    }, 1000);
};

/*A function that is always running.
originally used for checking if the player is dead but now determines the spawnsound for the zombies*/
var constantCheck = setInterval(function(){
    spawnSound = spawnSoundsValue[Math.floor(Math.random() * spawnSoundsValue.length)];
}, 1);

//Function for creating and adding new elements to the HTML
function addHTMLelement(elementType, content, parentElement){
    let newElName = document.createElement(elementType);     //Create a new element
    let contentName = document.createTextNode(content);     //Create a peice of text for the new element
    newElName.appendChild(contentName);       //Make the new content a child of an existing element
    parentElement.appendChild(newElName);      //Make the element a child of an existing element, making it a part of the webpage
};





//What happens when you click on one of the zombies (AKA 90% of the entire game)
function shoot (targetNumber){

    //Generate random numbers each time a zombie is shot, for determining the respawn time and death-sounds
    var respawnTime = Math.floor(Math.random() * 15000) + 1000;
    var deathSound = deathSoundsValue[Math.floor(Math.random() * deathSoundsValue.length)];

    //Effects for the shotgun
    shotgun[0].setAttribute("src", "images/ShotgunFire.png");
    playSound(shotgunSound);

    //"Kills" the appropriate zombie, and removes the ability to click on said zombie
    target[targetNumber].removeAttribute("onclick");
    target[targetNumber].style.backgroundImage = 'url("images/ZombieDead.png")';
    playSound(deathSound);
    shotCheck = true;

    //Add a point to the score
    if (pointCheckIDs[targetNumber] == true){
        point.innerHTML++;
        point.innerHTML++;
        /*Try to update this in the future, so that it can be done on only one line*/
    }
    else {
        point.innerHTML++;
    }

    //Quickly remove the shotgun muzzle effect
    setTimeout(function(){
        shotgun[0].setAttribute("src", "images/Shotgun.png")
    }, 50);

    //Make the zombie corpses disappear
    setTimeout(function(){
        target[targetNumber].style.backgroundImage = 'none';
    }, 1000);

   respawnZombie(targetNumber, respawnTime);


    //Make the description change depending on how many points you have
    if (point.innerHTML == 50){
        updateText.innerHTML = "Destructive!";
    }
    else if (point.innerHTML == 100){
        updateText.innerHTML = "Brutal!";
    }
    else if (point.innerHTML == 150){
        updateText.innerHTML = "Ultra violence!";
    }
    else if (point.innerHTML == 200){
        updateText.innerHTML = "Nightmare!";
    }
    else if (point.innerHTML == 300){
        updateText.innerHTML = "Ultra nightmare!!";
    }
    else if (point.innerHTML == 666){
        updateText.innerHTML = "You should probably go do something else..";
    }
    else if (point.innerHTML == 1000){
        updateText.innerHTML = "How";
    }
};

//End of code

/*
Full to do list:
1. DONE Continue working on health system (see line 122)
2. DONE Add more sounds
3. Add some sort of debug menu that changes specific values for easier debugging
4. Add a "how to play" menu either as a part of the existing page or a separate page
5. POTENTIALLY CANCELLED (See point 7) Make the background change depending on how far the player has gotten
6. DONE Rework points system (see line 122)
7. Make the code more friendly to customizing (allow players to change the background, enemy sprites, sounds, etc)


*/