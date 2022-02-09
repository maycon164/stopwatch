const listOfLapsEl = document.getElementById("list-of-laps");
const laps = [];

const btnStartEl = document.getElementById("btn-start");
const btnRestartTimerEl = document.getElementById("btn-restart-timer");
const btnResetLapsEl = document.getElementById("btn-reset-laps");
const btnLapEl = document.getElementById("btn-lap");

const timerEl = document.getElementById("timer");

btnStartEl.addEventListener('click', event => {
    btnStartEl.classList.toggle('pressed-btn');

    if (btnStartEl.textContent.trim() === "START") {
        btnStartEl.textContent = "STOP"
        startCounter()
    } else {
        btnStartEl.textContent = "START"
        stopCounter();
    }

    showBtnRestart();
    playAudioButton();
});

btnLapEl.addEventListener('click', event => {
    btnLapEl.classList.toggle("pressed-btn")
    setTimeout(() => btnLapEl.classList.toggle("pressed-btn"), 100)

    playAudioButton();
    recordLap();
});

btnResetLapsEl.addEventListener('click', event => {
    laps.length = 0;
    showLaps();
});

btnRestartTimerEl.addEventListener('click', event => {
    this.initialTimestamp = 0;
    displayTimestamp();
    btnRestartTimerEl.style.display = "none";
})


function startCounter() {
    if (!timerHasStarted()) {
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
    let { minutes, seconds, miliseconds } = getTimestampValues();
    timerEl.textContent = getFormatTimestamp({ minutes, seconds, miliseconds });
}

function showBtnRestart() {
    if (timerHasStarted())
        btnRestartTimerEl.style.display = "block"
}

function playAudioButton() {
    new Audio("http://localhost:5500/src/sounds/jump-sound.wav").play();
}

function recordLap() {
    if (timerHasStarted()) {
        laps.push(getFormatTimestamp(getTimestampValues()));
        showLaps();
    }
}

function showLaps() {
    listOfLapsEl.innerHTML = "";
    let lapsCopy = lapsCopy.slice();

    lapsCopy.reverse().forEach((lap, index) => {
        let [minutes, seconds, miliseconds] = lap.split(":");
        let divLap = createLap({ minutes, seconds, miliseconds, index, length: laps.length });
        listOfLapsEl.innerHTML += divLap;
    })
}

function createLap({ minutes, seconds, miliseconds, index, length }) {
    let div =
        `<div class="container-lap">
        <p class="detach">Lap ${(length - index).toString().padStart(2, '0')} - 
        ${getFormatTimestamp({
            minutes, seconds, miliseconds
        })}
    </p>
        <br/>
        <hr/>
    </div>`

    return div;
}

function timerHasStarted() {
    return this.initialTimestamp != 0 && this.initialTimestamp;
}

function getFormatTimestamp({ minutes, seconds, miliseconds }) {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${miliseconds.toString().padStart(3, '0')}`;
}

function getTimestampValues() {
    let date = new Date(this.initialTimestamp);
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let miliseconds = date.getMilliseconds();
    return { minutes, seconds, miliseconds };
}