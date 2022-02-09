const listOfLapsEl = document.getElementById("list-of-laps");
const laps = [];

const btnRestartEl = document.getElementById("btn-restart");
const btnLapEl = document.getElementById("btn-lap");
const timer = document.getElementById("timer");
const btnStartEl = document.getElementById("btn-start");

btnStartEl.addEventListener('click', event => {
    btnStartEl.classList.toggle('pressed-btn');

    showBtnRestart();

    if (btnStartEl.textContent.trim() === "START") {
        btnStartEl.textContent = "STOP"
        startCounter()
    } else {
        btnStartEl.textContent = "START"
        stopCounter();
    }
    playAudioButton();
});

btnLapEl.addEventListener('click', event => {
    btnLapEl.classList.toggle("pressed-btn")
    playAudioButton();
    setTimeout(() => btnLapEl.classList.toggle("pressed-btn"), 100)

    recordLap();

});

btnRestartEl.addEventListener('click', event => {
    this.initialTimestamp = 0;
    displayTimestamp();
    btnRestartEl.style.display = "none";
})


function startCounter() {
    if (!this.initialTimestamp) {
        this.initialTimestamp = 0
    }

    this.idInterval = setInterval(updateCount, 1);
}

function stopCounter() {
    clearInterval(this.idInterval);
}

function updateCount() {
    this.initialTimestamp += 4;
    displayTimestamp();
}

function displayTimestamp() {
    let date = new Date(this.initialTimestamp);
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();
    let miliseconds = date.getMilliseconds().toString();
    this.timer.textContent = `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}:${miliseconds.padStart(3, '0')}`;
}

function showBtnRestart() {
    this.btnRestartEl = document.getElementById("btn-restart");
    if (this.initialTimestamp) {
        this.btnRestartEl.style.display = "block"
    }
}

function playAudioButton() {
    new Audio("http://localhost:5500/src/sounds/jump-sound.wav").play();
}

function recordLap() {
    if (this.initialTimestamp != 0 && this.initialTimestamp) {
        let date = new Date(this.initialTimestamp);
        let stringDate = `${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
        laps.push(stringDate);
        showLaps();
    }

}

function showLaps() {
    listOfLapsEl.innerHTML = "";
    laps.forEach((lap, index) => {

        let [minutes, seconds, miliseconds] = lap.split(":");

        let divLap = `                        
        <div class="container-lap">
            <p>Lap ${index + 1} - ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${miliseconds.padStart(3, '0')}</p>
            <br/>
            <hr/>
        </div>`

        listOfLapsEl.innerHTML += divLap;
    })
}