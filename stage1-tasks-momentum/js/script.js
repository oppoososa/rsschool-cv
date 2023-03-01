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
const audio = new Audio();
const playListElem = document.querySelector(".play-list");
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
CityIn.addEventListener("change", getWeather);
getWeather();
showTime();
changeBg();
getQuotes();
loadList();

function nextPlay() {
  playNum = playNum + 1;
  isPlay = false;
  playAudio();
}
function loadList() {
  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement("li");
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
  } else {
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
  localStorage.setItem("name", name_u.value);
}

function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name_u.value = localStorage.getItem("name");
  }
}
function RandomNum() {
  return Math.floor(Math.random() * (21 - 1) + 1);
}
function changeBg() {
  let bgNum_R = String(bgNumGl);
  let bgNum = bgNum_R.padStart(2, 0);
  ground.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
  getQuotes();
}
