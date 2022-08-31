console.log("Hello :)");

//En backupfunksjon som kan legges til på elementer som ikke er ferdige enda
function notAdded(){
    alert("Denne egenskapen har ikke blitt lagt til enda, beklager.");
};


//Koden som lar nettsiden bytte til "light theme"

//Definer de relevante delene av nettsiden som forskjellige variabler
let background = document.querySelector("body");
let whiteText = document.querySelectorAll(".text-light");
let edgeBG = document.querySelectorAll(".bg-dark");
let lightModeText = document.querySelector(".lightModeToggler");

//Sjekk om light theme allerede er aktivert
var lightCheck = false;

//Endre de forskjellige klassene på de relevante elementene, avhengig av hvilket tema som er valgt. Desverre funker ikke dette på tvers av sidene, og må skrus på om igjen.
function toggleLightMode(){
    if (lightCheck == false){
        background.style.backgroundColor = "white";
        for (let i = 0; i < whiteText.length; i++){
            whiteText[i].classList.replace("text-light", "text-dark")
        }
        for (let i = 0; i < edgeBG.length; i++){
            edgeBG[i].classList.replace("bg-dark", "bg-light")
            edgeBG[i].classList.replace("navbar-dark", "navbar-light")
        };
        lightModeText.innerHTML = "Dark theme";
        lightCheck = true;
        console.log("Light theme enabled. Be careful with your eyes.");
    }
    else if (lightCheck == true){
        background.style.backgroundColor = "black";
        for (let i = 0; i < whiteText.length; i++){
            whiteText[i].classList.replace("text-dark", "text-light")
        }
        for (let i = 0; i < edgeBG.length; i++){
            edgeBG[i].classList.replace("bg-light", "bg-dark")
            edgeBG[i].classList.replace("navbar-light", "navbar-dark")
        };
        lightModeText.innerHTML = "Light theme";
        lightCheck = false;
        console.log("Dark theme enabled. Welcome back.");
    }
}; 