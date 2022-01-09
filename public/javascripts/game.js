var popUp = document.getElementById('popUp');
var quitBtn = document.getElementById('quitBtn');
var noBtn = document.getElementById('noBtn');
var okBtn = document.getElementById('okBtn');
var toDim = document.querySelectorAll(".dim");
var yourScore = document.getElementById("yourScore");
var timer = document.querySelector("header");
var front = document.querySelectorAll(".front");
var fronts = document.getElementsByClassName("card");
var rears = document.querySelectorAll(".rear");
var cards = document.querySelectorAll(".card");
var finPopUpText = document.getElementById("popUpText2");
var finPopUp = document.getElementById("finPopUp");
var images_names = ["3me.jpg", "aerospace.jpg", "architecture.jpg", "aula.jpg", "church.jpg", "EEMCS.jpg", "library.jpg", "castle.jpg", "station.jpg", "xtudelft.jpg", "andy.jpg", "nuna.jpg", "satellite.jpg", "ice.jpg", "vermeer.jpg", "pottery.jpg", "lake.jpg", "sunset.jpg", "christmas.jpg", "ww2.jpg"];

let score = 0;
let seconds = 0;
let done = false;

/////////// Update timer every second ////////////////
for(let i=0; i<=500; i++){
    setTimeout(function(){
        if(done==false){
            timer.textContent = "Timer: " + i + "s";
            seconds = i;
        }
    }, 1000*i);
}

function pause(){
    done = true;
}

/////////// Make and shuffle array of 40 images ////////////////////
var images = []
for(let i=0; i<2; i++){
    for(let j=0; j<images_names.length; j++){
        images.push(images_names[j]);
    }
}
images = shuffle(images);
console.log(images);

function shuffle(array){
    for(let i=0; i<array.length; i++){
        let index = Math.floor(Math.random()*array.length);
        let temp = array[index];
        array[index] = array[i];
        array[i] = temp;
    }
    return array;
}

//////////////// Set the initial images ///////////////////
front.forEach(function(front){
    var icon = document.createElement("img");
    icon.src = "images/flame_card_not_found.png";
    front.appendChild(icon);
})

for(let i=0; i<images.length; i++){
    var icon = document.createElement("img");
    icon.src = "images/card_icons/" + images[i];
    rears[i].appendChild(icon);
}

//////////////// Quit button and pop up functionality ///////////
function activatePopUp(){
    popUp.style.display='block';
    for(e of toDim){
    e.style.opacity=0.5;
    }
}
quitBtn.addEventListener("click", activatePopUp);

function disactivatePopUp(){
    popUp.style.display='none';
    for(e of toDim){
    e.style.opacity=1;
    }
}
noBtn.addEventListener("click", disactivatePopUp);

function activateFinish(){
    finPopUp.style.display='block';
    for(e of toDim){
        e.style.opacity=0.5;
    }
}

okBtn.addEventListener("click", disactivateFinish);

function disactivateFinish(){
    finPopUp.style.display='none';
    for(e of toDim){
        e.style.opacity=1;
    }
}


//////////// Handling click on cards ////////////////
let pair = []
let id = []
// var inputs = document.getElementsByClassName("card");
for(let i=0; i<front.length; i++){
    front[i].addEventListener("click", function(){
        console.log("Something was clicked");
        if(pair.length<2){
            front[i].classList.add("open");
            pair.push(i);
            id.push(fronts[i].id);
        }
        if(pair.length == 2){
            if(images[pair[0]] == images[pair[1]] && id[0] != id[1]){
                setTimeout(function(){
                    let scoreDis = (((++score) / 20) * 100);
                    yourScore.textContent = "Your score: " + scoreDis + "%";
                    console.log("here");
                    front[pair[0]].className = "front open";
                    front[pair[1]].className = "front open";

                    front[pair[1]].childNodes[0].src = "images/flame_card_found.png";
                    front[pair[0]].childNodes[0].src = "images/flame_card_found.png";
                    cards[pair[0]].className="card found";
                    cards[pair[1]].className="card found";
                    pair = [];
                    if(scoreDis==100) {   
                        finPopUpText.textContent = "You finished in "+ seconds + " seconds!";
                        activateFinish();
                        pause();
                    }
                }, 1000);
            } else {
                setTimeout(function(){
                    if(pair[0]!=null){
                        front[pair[0]].className = "front close";
                    }
                    if(pair[1]!=null){
                        front[pair[1]].className = "front close";
                    }
                    if(pair[0]!=null){
                        front[pair[0]].className = "front";
                    }
                    if(pair[1]!=null){
                        front[pair[1]].className = "front";
                    }
                    pair = [];
                    id = [];
                }, 1000);
            }
        }
    }, 3000)
}
