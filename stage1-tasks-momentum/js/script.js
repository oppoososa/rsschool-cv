import playList from "./playList.js";
const time = document.querySelector(".timer");
const greet = document.querySelector(".greeting");
const date = document.querySelector(".date");
const name_u = document.querySelector(".name");
const ground = document.querySelector("body");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const CityIn = document.querySelector(".city");
const quote = document.querySelector(".quote");
const author = document.querySelector(".author");
const changeQuote = document.querySelector(".change-quote");
const playBtn = document.querySelector(".play");
const nextPlayBtn = document.querySelector(".play-next");
const prevPlayBtn = document.querySelector(".play-prev");
const audio = new Audio();
const playListElem = document.querySelector(".play-list");
const li = document.createElement("li");


let playNum = 0;
let timeOfDay = "";
let bgNumGl = RandomNum();
let isPlay = false;

window.addEventListener("beforeunload", setLocalStorage);
window.addEventListener("load", getLocalStorage);
slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);
changeQuote.addEventListener("click", getQuotes);
playBtn.addEventListener("click", playAudio);
nextPlayBtn.addEventListener("click", nextPlay);
prevPlayBtn.addEventListener("click", prevPlay);
CityIn.addEventListener("change", getWeather);
name_u.addEventListener("click", getNameDef);
getWeather();
showTime();
changeBg();
getQuotes();
loadList();
function getNameDef() {
  if (name_u.value == "What is your name?") {
    name_u.value = "";
    name_u.classList.remove("name-def");
  }
}
function nextPlay() {
  document.getElementById(`${playNum}-item`).classList.remove("li-def");
  if (playNum < playList.length - 1) {
    playNum = playNum + 1;
    isPlay = false;
    playAudio();
  } else {
    isPlay = true;
    playAudio();
  }
}

function prevPlay() {
  if (playNum > 0) {
    document.getElementById(`${playNum}-item`).classList.remove("li-def");
    playNum = playNum - 1;
    isPlay = false;
    playAudio();
    return playNum;
  } else {
    isPlay = true;
    playAudio();
  }
}

function loadList() {
  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement("li");
    li.setAttribute("id",`${i}-item`)
    li.className = "play-item";
    playListElem.append(li);
    li.textContent = playList[i].title;
  }
}

function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  if (isPlay == false) {
    playBtn.classList.remove("play");
    playBtn.classList.add("pause");
    audio.play();
    isPlay = true;
    document.getElementById(`${playNum}-item`).classList.add("li-def");
  } else {
    document.getElementById(`${playNum}-item`).classList.remove("li-def");
    playBtn.classList.remove("pause");
    playBtn.classList.add("play");
    audio.pause();
    isPlay = false;
  }
}

function showTime() {
  getTimeOfDay();
  showData();
  const data = new Date();
  const currentTime = data.toLocaleTimeString();
  time.textContent = currentTime;
  setTimeout(showTime, 1000);
}
function getSlideNext() {
  if (bgNumGl < 20) {
    bgNumGl += 1;
  } else if (bgNumGl == 20) {
    bgNumGl = 1;
  }
  changeBg();
}
function getSlidePrev() {
  if (bgNumGl > 1) {
    bgNumGl -= 1;
  } else if (bgNumGl == 1) {
    bgNumGl = 20;
  }
  changeBg();
}
async function getWeather() {
  if (CityIn.value == false) {
    CityIn.value = `Вологда`;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CityIn.value}&lang=ru&appid=c3c49ce84e899bde6e8a8245434614a3&units=metric`
    );
    const data = await res.json();
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;
  } else {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${CityIn.value}&lang=ru&appid=c3c49ce84e899bde6e8a8245434614a3&units=metric`
    );
    const data = await res.json();
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;
  }
}
async function getQuotes() {
  let quotNoSplit = RandomNum();
  const quotes = "js/data.json";
  const res = await fetch(quotes);
  const data = await res.json();
  quote.textContent = data[quotNoSplit].text;
  author.textContent = data[quotNoSplit].author;
}

function showData() {
  const data = new Date();
  const options = { month: "long", weekday: "long", day: "numeric" };
  const currentData = data.toLocaleTimeString("ru-RU", options);
  date.textContent = currentData;
}

function getTimeOfDay() {
  const data = new Date();
  const hours = data.getHours();
  let hour = "";
  if (16 <= hours && hours <= 23) {
    hour = "evening";
  } else if (0 <= hours && hours < 5) {
    hour = "night";
  } else if (5 <= hours && hours < 12) {
    hour = "morning";
  } else if (12 <= hours && hours < 16) {
    hour = "afternoon";
  }
  if (hour != hour) {
    changeBg();
  }
  greet.textContent = `Good ${hour}`;
  timeOfDay = hour;
}

function setLocalStorage() {
  if (name_u.value != "What is your name?") {
    localStorage.setItem("name", name_u.value);
  }
}

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name_u.value = localStorage.getItem("name");
  } else {
    name_u.value = "What is your name?";
    name_u.classList.add("name-def");
  }
}
function RandomNum() {
  return Math.floor(Math.random() * (20 - 1) + 1);
}
function changeBg() {
  let bgNum_R = String(bgNumGl);
  let bgNum = bgNum_R.padStart(2, 0);

  const img = new Image();
  img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.onload = () => {
    ground.style.backgroundImage = `url(${img.src})`;
  };
  getQuotes();
}
