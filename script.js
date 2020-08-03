const body = document.querySelector('body');
const colorInput1 = document.querySelector('#color1');
const colorInput2 = document.querySelector('#color2');
const output = document.querySelector('p');
const favorites = document.querySelector('.favorites');
const random = document.querySelector('#random');
const button = document.querySelector('#addFav');
let db = loadLocalStorage();
let color1; 
let color2;

randomize();
buildFavorites(db);

colorInput1.addEventListener('input', e =>{
    color1 = colorInput1.value;
    setBGandPrintOutput(color1, color2);
})

colorInput2.addEventListener('input', e => {
    color2 = colorInput2.value;
    setBGandPrintOutput(color1, color2);
})

button.addEventListener('click', function(){
    let gradient = constructGradientString(color1,color2);
    createNewFav(gradient);
    saveToLocalStorage(gradient);
    randomize();
});

random.addEventListener('click', function(){
    randomize();
})

favorites.addEventListener('click', function(e){
    if(e.target.tagName === "SPAN") {
        let gradient = e.target.parentNode.getAttribute('gradient');
        db = removeFromFavorites(gradient);
        removeFavFromUi(e);
    } else if ( e.target.tagName === "LI") {
        loadFromFavorite(e);
    }
})

//FUNCTIONS
function printOutput (color1, color2) {
    output.innerText = constructGradientString(color1, color2);
}

function generateHexNum(){
    return Math.floor(Math.random()*1000000);
}

function generateRandomColor(){
    let randomHex = generateHexNum();
    while (randomHex < 100000) {
        randomHex = generateHexNum();
    }
    return `#${randomHex}`;
}

function constructGradientString(...colors){
    let gradient = `linear-gradient(to right,`;
    for( let i = 0; i < colors.length; i++ ) {
        if(colors.length - i === 1) {
            gradient+= `${String(colors[i])}`
        } else {
            gradient+= `${String(colors[i])},`
        }

    }
    gradient += `)`;
    return gradient;
}

function setBGandPrintOutput(color1, color2){
    body.style.backgroundImage = constructGradientString(color1, color2);
    printOutput(color1, color2);
}

function loadLocalStorage () {
    let db = localStorage.getItem('gradients') || [];
    if(typeof db === "string"){
        db = db.split('),');
    }
    return db;
}

function buildFavorites( favGradients ) {
    favGradients.forEach( favGradient => {
        createNewFav(favGradient);
    });
}

function saveToLocalStorage (gradient) {
    db.push(gradient);
    localStorage.setItem('gradients', db);
}

async function deleteFavorite(gradient) {
    await removeFromDb(gradient);
    //remove from ui
}

function removeFromFavorites(gradient){
    updatedDb = db.filter( val => {
        return val !== gradient;
    });
    return updatedDb;
}

function removeFavFromUi(ev){
    ev.target.parentNode.remove();
}

function createNewFav (gradient){
    let li = document.createElement('li');
    let span = document.createElement('span');
    li.appendChild(span);
    span.innerText = "X";
    li.setAttribute('gradient', gradient);
    li.style.backgroundImage = gradient;
    favorites.append(li);
}

function loadFromFavorite(ev){
    let gradient = String(ev.target.getAttribute('gradient'));
    setInputValues(gradient);
    body.style.backgroundImage = gradient;
    output.innerText = gradient;
}

function randomize(){
    color1 = colorInput1.value = generateRandomColor();
    color2 = colorInput2.value = generateRandomColor();
    setBGandPrintOutput(color1, color2);
}

function setInputValues(gradient) {
    colorInput1.value = gradient.slice(25,32);
    colorInput2.value = gradient.slice(33, 40);
}

