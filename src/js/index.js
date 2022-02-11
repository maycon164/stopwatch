const listOfLapsEl = document.querySelector("#list-of-laps");
const laps = [];

const btnStartStopEl = document.querySelector("#btn-start-stop-timer");
const btnRestartTimerEl = document.querySelector("#btn-restart-timer");
const btnResetLapsEl = document.querySelector("#btn-reset-laps");
const btnLapEl = document.querySelector("#btn-lap");

const timerEl = document.querySelector("#timer");
let initialTimestamp = 0;
const updateRate = 10;

btnStartStopEl.addEventListener('click', event => {
    btnStartStopEl.classList.toggle('pressed-btn');

    if (btnStartStopEl.textContent.trim() === "START") {
        btnStartStopEl.textContent = "STOP";
        startTimer();
    } else {
        btnStartStopEl.textContent = "START";
        stopTimer();
    }

    showBtnRestartTimer();
    playAudioButton();
});

btnLapEl.addEventListener('click', event => {
    btnLapEl.classList.toggle("pressed-btn");
    setTimeout(() => btnLapEl.classList.toggle("pressed-btn"), 100);

    playAudioButton();
    recordLap();
    showBtnRestartLaps();
});

btnResetLapsEl.addEventListener('click', event => {

    if (!lapsIsEmpty()) {
        laps.length = 0;
        btnResetLapsEl.style.display = "none";
        showLapsInReverseOrder();
    }

});

btnRestartTimerEl.addEventListener('click', event => {

    if (timerHasStarted()) {
        initialTimestamp = 0;
        displayTimer();
        btnRestartTimerEl.style.display = "none";
    }

});

function startTimer() {
    if (!timerHasStarted()) {
        initialTimestamp = 0
    }

    this.idIntervalTimer = setInterval(updateTimer, updateRate);
}

function stopTimer() {
    clearInterval(this.idIntervalTimer);
}

function updateTimer() {
    initialTimestamp += updateRate;
    displayTimer();
}

function displayTimer() {
    timerEl.innerHTML = getFormattedTimestamp(initialTimestamp);
}

function showBtnRestartTimer() {
    if (timerHasStarted())
        btnRestartTimerEl.style.display = "block"
}
function showBtnRestartLaps() {
    if (!lapsIsEmpty())
        btnResetLapsEl.style.display = "block"
}


function playAudioButton() {
    new Audio("http://localhost:5500/src/sounds/jump-sound.wav").play();
}

function recordLap() {
    if (timerHasStarted()) {
        let currentTimestamp = getTimestamp();
        let lastLap = laps[laps.length - 1] || { timestamp: 0 };

        if (currentTimestamp == lastLap.timestamp) {
            return;
        }

        let timeDifference = currentTimestamp - lastLap.timestamp

        let lap = {
            timestamp: currentTimestamp,
            difference: timeDifference
        }

        laps.push(lap);
        showLapsInReverseOrder();
    }
}

function showLapsInReverseOrder() {
    listOfLapsEl.innerHTML = "";

    if (!lapsIsEmpty()) {
        let lapsCopy = laps.slice();

        lapsCopy.reverse().forEach((lap, index) => {
            let divLap = createLap(lap, laps.length - index);
            listOfLapsEl.innerHTML += divLap;
        })
    }
}

function createLap(lap, index) {

    let div = `
    <div class="container-lap detach">
        <p>Lap ${pad0(index, 2)}</p>
        <p> ${getFormattedTimestamp(lap.timestamp)}</p>
        <small> +${getFormattedTimestamp(lap.difference)}</small>
    </div>
    <hr>`
    return div;
}

function getFormattedTimestamp(timestamp) {
    let date = new Date(timestamp);
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let miliseconds = date.getMilliseconds();

    return `${pad0(minutes, 2)}:${pad0(seconds, 2)}.${pad0(Math.floor(miliseconds / 10), 2)}`;
}

function pad0(number, amount) {
    return number.toString().padStart(amount, '0');
}

function getTimestamp() {
    return initialTimestamp;
}

function timerHasStarted() {
    return initialTimestamp != 0 && initialTimestamp;
}
function lapsIsEmpty() {
    return laps.length == 0;
}


//KEYBOARD EVENTS
document.addEventListener("keyup", event => {
    (event.key == "Enter") ? btnStartStopEl.click() : null;
    (event.key == "Backspace") ? btnRestartTimerEl.click() : null;

    (event.key == " ") ? btnLapEl.click() : null;
    (event.key == "Escape") ? btnResetLapsEl.click() : null;
});