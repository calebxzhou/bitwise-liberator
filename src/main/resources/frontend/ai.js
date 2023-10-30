document.getElementById("output").onclick = output
let content = document.getElementById("content");
let str;
let words;
const maxWords = getRandomInt(1000, 1200)

function output() {
    content.innerHTML = ""
    move()
    str = shuffleArray(sentences).join(".")
    words = str.split(" ")
    addWords(0)
}

function addWords(i) {
    if (i < maxWords) {
        let textNode = document.createTextNode(words[i] + ' ');
        content.appendChild(textNode);
        setTimeout(() => addWords(i + 1), 50);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const sentences = document.getElementById("testEssay").innerText.split(".")

let i = 0;

function move() {
    if (i === 0) {
        i = 1;
        const elem = document.getElementById("myBar");
        let width = 1;
        const id = setInterval(frame, 100);

        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width += 0.3;
                elem.style.width = width + "%";
                elem.innerHTML = width.toFixed(2) + "%";
            }
        }
    }
}