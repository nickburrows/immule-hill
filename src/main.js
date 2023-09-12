import $ from 'jquery'; //  引入 jQuery
window.$ = $; //  挂载 jQuery
window.jQuery = $; //  挂载 jQuery

import './css/global.css';
import './css/style.css';
import 'flowbite';

import png404 from './images/404.png';
import testPng from './images/test.png';
import clearPng from './images/clear.png';
import rainPng from './images/rain.png';
import snowPng from './images/snow.png';
import cloudPng from './images/cloud.png';
import mistPng from './images/mist.png';

const container = document.querySelector('#weatherApp');
const searchInput = document.querySelector('#searchInput');
const search = document.querySelector('#searchBtn');
const weatherDetails = document.getElementById('weatherDetails');
const imgTest = document.getElementById('imgTest');
const error404 = document.getElementById('notFound');
const weatherBox = document.getElementById('weatherBox');
const APIKey = process.env.OPENWEATHERMAP_API_KEY;

const controller = new AbortController();
const signal = controller.signal;

$(document).ready(function () {
  console.log('ready!');
});

function getWeatherInfo(openWeatherURL) {
  $.post(openWeatherURL, function (data) {
    if (data) {
      $('#status1').addClass('hidden');
      $('#status2').addClass('hidden');
    }
  }).done(function (json) {
    switch (json.weather[0].main) {
      case 'Clear':
        $('#weatherBox img').attr('src', clearPng);
        break;

      case 'Rain':
        $('#weatherBox img').attr('src', rainPng);
        break;

      case 'Snow':
        $('#weatherBox img').attr('src', snowPng);
        break;

      case 'Clouds':
        $('#weatherBox img').attr('src', cloudPng);
        break;

      case 'Haze':
        $('#weatherBox img').attr('src', mistPng);
        break;

      default:
        $('#weatherBox img').attr('src', '');
    }
    $('#temperature').append(`${parseInt(json.main.temp)}<span>°C</span>`);
    $('#description').append(`${json.weather[0].description}`);
    $('#humidityText').append(`${json.main.humidity}%`);
    $('#windText').append(`${parseInt(json.wind.speed)}m/s`);
    $('#weatherBox').removeClass('hidden').addClass('flex fadeIn');
    $('#weatherDetails').removeClass('hidden').addClass('flex fadeIn');
    $('#weatherApp').height(590);
    // console.log(json);
  });
}

if (
  localStorage.getItem('color-theme') === 'dark' ||
  (!('color-theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem('color-theme') === 'dark' ||
  (!('color-theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  themeToggleLightIcon.classList.remove('hidden');
} else {
  themeToggleDarkIcon.classList.remove('hidden');
}

const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle('hidden');
  themeToggleLightIcon.classList.toggle('hidden');

  // if set via local storage previously
  if (localStorage.getItem('color-theme')) {
    if (localStorage.getItem('color-theme') === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
  }
});

const notFound = document.querySelectorAll('#notFound');
for (const el of notFound) {
  const imgEl = document.createElement('img');
  imgEl.src = png404;
  const pEl = el.querySelector('p');
  el.insertBefore(imgEl, pEl);
}
const weatherBoxEl = document.querySelectorAll('#weatherBox');
for (const el of weatherBoxEl) {
  const imgEl = document.createElement('img');
  imgEl.src = testPng;
  const pEl = el.querySelector('p');
  el.insertBefore(imgEl, pEl);
}

searchInput.addEventListener('search', event => {
  if (event.keyCode === 13) {
    console.log(searchInput.value);
  }
});

container.addEventListener('submit', formSubmit);

async function formSubmit(event) {
  event.preventDefault();
  const city = document.querySelector('#searchInput').value;

  if (city === '') return;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
    );
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const result = await response.json();
    return displayWeather(result);
  } catch (err) {
    console.log(err);
  }
}
function displayNotFound() {
  container.style.height = '400px';
  weatherBox.style.display = 'none';
  weatherDetails.style.display = 'none';
  error404.style.display = 'block';
  error404.classList.add('fadeIn');
}
function displayWeather(data) {
  console.log(data);
  if (data.code === '404') {
    container.style.height = '400px';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'block';
    error404.classList.add('fadeIn');
    return;
  }

  error404.style.display = 'none';
  error404.classList.remove('fadeIn');

  const image = document.querySelector('#weatherBox img');
  const temperature = document.querySelector('#weatherBox #temperature');
  const description = document.querySelector('#weatherBox #description');
  const humidityText = document.querySelector(
    '#weatherDetails #humidity #humidityText'
  );
  const windText = document.querySelector('#weatherDetails #wind #windText');
  // const iconNum = data.weather[0].icon;
  // const weatherIconURL = `https://openweathermap.org/img/wn/${iconNum}@2x.png`;
  // image.src = weatherIconURL;
  switch (data.weather[0].main) {
    case 'Clear':
      image.src = clearPng;
      break;

    case 'Rain':
      image.src = rainPng;
      break;

    case 'Snow':
      image.src = snowPng;
      break;

    case 'Clouds':
      image.src = cloudPng;
      break;

    case 'Haze':
      image.src = mistPng;
      break;

    default:
      image.src = '';
  }

  temperature.innerHTML = `${parseInt(data.main.temp)}<span>°C</span>`;
  description.innerHTML = `${data.weather[0].description}`;
  humidityText.innerHTML = `${data.main.humidity}%`;
  windText.innerHTML = `${parseInt(data.wind.speed)}m/s`;

  weatherBox.classList.remove('hidden');
  weatherBox.classList.add('flex', 'fadeIn');

  weatherDetails.classList.remove('hidden');
  weatherDetails.classList.add('flex', 'fadeIn');
  container.style.height = '590px';
}

function geoFindMe() {
  const status = document.querySelector('#status');
  const mapLink = document.querySelector('#map-link');

  mapLink.href = '';
  mapLink.textContent = '';

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = '';
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}
function getGeoLocation() {
  const status1 = document.getElementById('status1');
  const status2 = document.getElementById('status2');
  status1.classList.remove('hidden');
  status2.classList.remove('hidden');
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const geoURL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${APIKey}`;
    const openWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;
    geoLocation(geoURL);
    getWeatherInfo(openWeatherURL);
  });
}
async function geoLocation(geoURL) {
  try {
    console.log(geoURL);
    const response = await fetch(geoURL);
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);

    return (searchInput.value = json[0].name);
  } catch (err) {
    console.log(err);
  }
}

document.querySelector('#nearMe').addEventListener('click', getGeoLocation);
document.querySelector('#find-me').addEventListener('click', geoFindMe);
