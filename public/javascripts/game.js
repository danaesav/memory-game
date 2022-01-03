var popUp = document.getElementById('popUp');
var quitBtn = document.getElementById('quitBtn');
var noBtn = document.getElementById('noBtn');
var toDim = document.querySelectorAll(".dim");
var fronts = document.querySelectorAll(".front");
var rears = document.querySelectorAll(".rear");
var images_names = ["3me.jpg", "aerospace.jpg", "architecture.jpg", "aula.jpg", "church.jpg", "EEMCS.jpg", "library.jpg", "castle.jpg", "station.jpg", "xtudelft.jpg", "andy.jpg", "nuna.jpg", "satellite.jpg", "ice.jpg", "vermeer.jpg", "pottery.jpg", "lake.jpg", "sunset.jpg", "christmas.jpg", "ww2.jpg"];


// Make and shuffle array of 40 images 
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

// Set the fronts
fronts.forEach(function(front){
    var icon = document.createElement("img");
    icon.src = "images/flame3.png";
    front.appendChild(icon);
})


for(let i=0; i<images.length; i++){
    var icon = document.createElement("img");
    icon.src = "images/card_icons/" + images[i];
    rears[i].appendChild(icon);
}


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

fronts.forEach(function(front){
    front.addEventListener("click", function(){
        front.className="front slide";
    });
})


