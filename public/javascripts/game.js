var popUp = document.getElementById('popUp');
var quitBtn = document.getElementById('quitBtn');
var noBtn = document.getElementById('noBtn');
var toDim = document.querySelectorAll(".dim");
var yourScore = document.getElementById("yourScore");
var timer = document.querySelector("header");
var fronts = document.querySelectorAll(".front");
var rears = document.querySelectorAll(".rear");
var cards = document.querySelectorAll(".card");
var images_names = ["3me.jpg", "aerospace.jpg", "architecture.jpg", "aula.jpg", "church.jpg", "EEMCS.jpg", "library.jpg", "castle.jpg", "station.jpg", "xtudelft.jpg", "andy.jpg", "nuna.jpg", "satellite.jpg", "ice.jpg", "vermeer.jpg", "pottery.jpg", "lake.jpg", "sunset.jpg", "christmas.jpg", "ww2.jpg"];

let score = 0;

/////////// Update timer every second ////////////////
for(let i=0; i<=500; i++){
    setTimeout(function(){
        timer.textContent = "Timer: " + i + "s";
    }, 1000*i);
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
fronts.forEach(function(front){
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


//////////// Handling click on cards ////////////////
let pair = []
for(let i=0; i<fronts.length; i++){
    fronts[i].addEventListener("click", function(){
        console.log("Something was clicked");
        if(pair.length<2){
            fronts[i].classList.add("slide-up");
            pair.push(i);
        }
        if(pair.length == 2){
            if(images[pair[0]] == images[pair[1]]){
                setTimeout(function(){
                    yourScore.textContent = "Your score: " + (((++score) / 20) * 100) + "%";
                    fronts[pair[0]].className = "front slide-down";
                    fronts[pair[1]].className = "front slide-down";

                    fronts[pair[0]].childNodes[0].src = "images/flame_card_found.png";
                    fronts[pair[1]].childNodes[0].src = "images/flame_card_found.png";
                    cards[pair[0]].className="card found";
                    cards[pair[1]].className="card found";
                    pair = [];
                }, 2000);
            }else{
                setTimeout(function(){
                    fronts[pair[0]].className = "front slide-down";
                    fronts[pair[1]].className = "front slide-down";
                }, 2000);
                setTimeout(function(){
                    fronts[pair[0]].className="front";
                    fronts[pair[1]].className="front";
                    pair = [];
                }, 2500);
            }
        }
        
    })
}
