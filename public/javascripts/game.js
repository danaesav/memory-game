var popUp = document.getElementById('popUp');
var quitBtn = document.getElementById('quitBtn');
var noBtn = document.getElementById('noBtn');
var toDim = document.querySelectorAll(".dim");

console.log(toDim);

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