const listOfLapsEl = document.getElementById("list-of-laps");
const laps = [];

const btnStartEl = document.getElementById("btn-start");
const btnRestartTimerEl = document.getElementById("btn-restart-timer");
const btnResetLapsEl = document.getElementById("btn-reset-laps");
const btnLapEl = document.getElementById("btn-lap");

const timerEl = document.getElementById("timer");
let initialTimestamp = 0;

btnStartEl.addEventListener('click', event => {
    btnStartEl.classList.toggle('pressed-btn');

    if (btnStartEl.textContent.trim() === "START") {
        btnStartEl.textContent = "STOP"
        startCounter()
    } else {
        btnStartEl.textContent = "START"
        stopCounter();
    }

    showBtnRestartTimer();
    playAudioButton();
});

btnLapEl.addEventListener('click', event => {
    btnLapEl.classList.toggle("pressed-btn")
    setTimeout(() => btnLapEl.classList.toggle("pressed-btn"), 100)

    playAudioButton();
    recordLap();
    showBtnRestartLaps();
});

btnResetLapsEl.addEventListener('click', event => {
    laps.length = 0;
    btnResetLapsEl.style.display = "none";
    showLaps();
});

btnRestartTimerEl.addEventListener('click', event => {
    initialTimestamp = 0;
    displayTimestamp();

    btnRestartTimerEl.style.display = "none";
})


function startCounter() {

    if (!timerHasStarted()) {
        initialTimestamp = 0
    }

    this.idInterval = setInterval(updateCount, 1);
}

function stopCounter() {
    clearInterval(this.idInterval);
}

function updateCount() {
    initialTimestamp += 4;
    displayTimestamp();
}

function displayTimestamp() {
    timerEl.innerHTML = getFormattedTimestamp(initialTimestamp);
}

function showBtnRestartTimer() {
    if (timerHasStarted())
        btnRestartTimerEl.style.display = "block"
}
function showBtnRestartLaps() {
    if (!lapsIsEmpty()) {
        btnResetLapsEl.style.display = "block"
    }
}

function playAudioButton() {
    new Audio("http://localhost:5500/src/sounds/jump-sound.wav").play();
}

function recordLap() {
    if (timerHasStarted()) {
        let currentTimestamp = getTimestampValue();
        let timeDifference = currentTimestamp;

        if (laps.length > 0) {
            timeDifference = currentTimestamp - laps[laps.length - 1].timestamp;
        }

        let lap = {
            timestamp: currentTimestamp,
            difference: timeDifference
        }

        laps.push(lap);

        showLaps();
    }
}

function showLaps() {
    listOfLapsEl.innerHTML = "";

    if (!lapsIsEmpty()) {
        let lapsCopy = laps.slice();

        lapsCopy.reverse().forEach((lap, index) => {
            let divLap = createLap({ lap, index, length: laps.length });
            listOfLapsEl.innerHTML += divLap;
        })
    }
}

function createLap({ lap, index, length }) {
    let div = `
    <div class="container-lap detach">
        <p>Lap ${(length - index).toString().padStart(2, '0')}</p>
        <p> ${getFormattedTimestamp(lap.timestamp)}</p>
        <small> +${getFormattedTimestamp(lap.difference)}</small>
    </div>
    <hr>`
    return div;
}

function timerHasStarted() {
    return initialTimestamp != 0 && initialTimestamp;
}
function lapsIsEmpty() {
    return laps.length == 0;
}

function getFormattedTimestamp(timestamp) {
    let date = new Date(timestamp);
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let miliseconds = date.getMilliseconds();
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${miliseconds.toString().padStart(3, '0')}`;
}

function getTimestampValue() {
    return initialTimestamp;
}

//KEYBOARD EVENTS

document.addEventListener("keyup", event => {
    (event.key == "Enter") ? btnStartEl.click() : null;
    (event.key == "Backspace") ? btnRestartTimerEl.click() : null;

    (event.key == " ") ? btnLapEl.click() : null;
    (event.key == "Escape") ? btnResetLapsEl.click() : null;
});