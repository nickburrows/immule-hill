import './style.css';
const url = 'sintel.mp4';

const MDI_URL = 'https://fonts.google.com/metadata/icons';
const MOCK_JSON =
  'https://my-json-server.typicode.com/nickburrows/picgo_assets/db';
const API_URL = 'https://open.er-api.com/v6/latest/';

// For selecting different controls
const searchBox = document.querySelector('#searchBox');
const convertBtn = document.querySelector('#convertBtn');
const fromCurrecy = document.querySelector('#fromCurrecy');
const toCurrecy = document.querySelector('#toCurrecy');
const finalValue = document.querySelector('#finalValue');
const finalAmount = document.getElementById('finalAmount');

const videoWrapper = document.querySelector('.videoWrapper');
const downloadBtn = document.querySelector('.download');
const abortBtn = document.querySelector('.abort');
const reports = document.querySelector('.reports');

const searchInput = document.querySelector('#search-input');
const accessBtn = document.querySelector('.access');
const fetchResult = document.querySelector('.fetch-result');
const fetchBtn = document.querySelector('.fetch');
const stopFetchBtn = document.querySelector('.stop-fetch');
const fetchMsg = document.querySelector('.fetch-message');
const respCode = document.querySelector('.resp-code');
const respText = document.querySelector('.resp-text');
const priceInput = document.querySelector('#price-input');
const changeBtn = document.querySelector('#price-change');
const testPrice = document.querySelector('#test-price');

let controller;
let progressAnim;
let animCount = 0;
let query = '';
let icons = null;

let resultFrom = fromCurrecy.value;
let resultTo = 'TWD';
let searchValue;

downloadBtn.addEventListener('click', fetchVideo);

abortBtn.addEventListener('click', () => {
  controller.abort();
  console.log('Download aborted');
  downloadBtn.classList.remove('hidden');
});

function fetchVideo() {
  controller = new AbortController();
  const signal = controller.signal;
  downloadBtn.classList.add('hidden');
  abortBtn.classList.remove('hidden');
  reports.textContent = 'Video awaiting download...';
  fetch(url, { signal })
    .then(response => {
      if (response.status === 200) {
        runAnimation();
        setTimeout(() => console.log('Body used: ', response.bodyUsed), 1);
        return response.blob();
      } else {
        throw new Error('Failed to fetch');
      }
    })
    .then(myBlob => {
      const video = document.createElement('video');
      video.setAttribute('controls', '');
      video.src = URL.createObjectURL(myBlob);
      videoWrapper.appendChild(video);

      videoWrapper.classList.remove('hidden');
      abortBtn.classList.add('hidden');
      downloadBtn.classList.add('hidden');

      reports.textContent = 'Video ready to play';
    })
    .catch(e => {
      abortBtn.classList.add('hidden');
      downloadBtn.classList.remove('hidden');
      reports.textContent = 'Download error: ' + e.message;
    })
    .finally(() => {
      clearInterval(progressAnim);
      animCount = 0;
    });
}

function runAnimation() {
  progressAnim = setInterval(() => {
    switch (animCount++ & 3) {
      case 0:
        reports.textContent =
          'Download occuring; waiting for video player to be constructed';
        break;
      case 1:
        reports.textContent =
          'Download occuring; waiting for video player to be constructed.';
        break;
      case 2:
        reports.textContent =
          'Download occuring; waiting for video player to be constructed..';
        break;
      case 3:
        reports.textContent =
          'Download occuring; waiting for video player to be constructed...';
        break;
    }
  }, 300);
}

fetchBtn.addEventListener('click', fetchIcons);

function mockJSON() {
  controller = new AbortController();
  const signal = controller.signal;
  fetch(MDI_URL, { signal })
    .then(response => {
      console.log('response.type =', response.type);
      console.log('response.url =', response.url);
      console.log('response.userFinalURL =', response.useFinalURL);
      console.log('response.status =', response.status);
      console.log('response.ok =', response.ok);
      console.log('response.statusText =', response.statusText);
      console.log('response.headers =', response.headers);
      if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
      }
      //   const body = response.text();
      //   const json = JSON.parse(body.replace(/^.+?\n/, ""));
      //   return json.icons.map(icon => {
      //     const assets = json.families.map(family => {
      //       const path = json.asset_url_pattern
      //         .replace("{family}", family.toLowerCase().replace(/\W+/g, ""))
      //         .replace("{icon}", icon.name)
      //         .replace("{version}", String(icon.version))
      //         .replace("{asset}", `${icon.sizes_px[0] ?? 24}px`);
      //       const url = `https://${json.host}/${path}.svg`;

      //       return { family, url };
      //     });

      //     return {
      //       categories: icon.categories.join(", "),
      //       codepoint: icon.codepoint.toString(16),
      //       name: icon.name,
      //       tags: icon.tags,
      //       assets,
      //     };
      //   });
      return response.blob();
    })
    .then()
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log('Error:', error.message);
    });
}
async function fetchIcons() {
  controller = new AbortController();
  const signal = controller.signal;

  const response = await fetch(MDI_URL, { signal });
  //   const response = await fetch(MOCK_JSON, { signal });
  const body = await response.text();
  const json = JSON.parse(body.replace(/^.+?\n/, ''));

  return json.icons.map(icon => {
    const assets = json.families.map(family => {
      const path = json.asset_url_pattern
        .replace('{family}', family.toLowerCase().replace(/\W+/g, ''))
        .replace('{icon}', icon.name)
        .replace('{version}', String(icon.version))
        .replace('{asset}', `${icon.sizes_px[0] ?? 24}px`);
      const url = `https://${json.host}/${path}.svg`;

      return { family, url };
    });

    return {
      categories: icon.categories.join(', '),
      codepoint: icon.codepoint.toString(16),
      name: icon.name,
      tags: icon.tags,
      assets,
    };
  });
}

function Access() {
  const s = searchInput.value;
  document.querySelector('.innerTest').innerHTML = s;
}

let enterEventCount = 0;
let leaveEventCount = 0;
const mouseTarget = document.getElementById('mouseTarget');
const unorderedList = document.getElementById('unorderedList');

mouseTarget.addEventListener('mouseenter', e => {
  mouseTarget.style.border = '5px dotted orange';
  mouseTarget.style.color = '#6b7280';
  enterEventCount++;
  addListItem(`This is mouseenter event ${enterEventCount}.`);
});

mouseTarget.addEventListener('mouseleave', e => {
  mouseTarget.style.border = '1px solid #f3f4f6';
  mouseTarget.style.color = '#ffffff';
  leaveEventCount++;
  addListItem(`This is mouseleave event ${leaveEventCount}.`);
});

function addListItem(text) {
  // Create a new text node using the supplied text
  const newTextNode = document.createTextNode(text);

  // Create a new li element
  const newListItem = document.createElement('li');

  // Add the text node to the li element
  newListItem.appendChild(newTextNode);

  // Add the newly created list item to list
  unorderedList.appendChild(newListItem);
}

// When true, moving the mouse draws on the canvas
let isDrawing = false;
let x = 0;
let y = 0;

const myPics = document.getElementById('myPics');
const context = myPics.getContext('2d');

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
myPics.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});

myPics.addEventListener('mousemove', e => {
  if (isDrawing) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = '#f3f4f6';
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function PriceChange() {
  // const ch = priceInput.value
  const number = 100;
  const jpy = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(number);
  testPrice.innerHTML = ch;
}

// Event when currency is changed
fromCurrecy.addEventListener('change', event => {
  resultFrom = `${event.target.value}`;
});

console.log(resultFrom);

// Event when currency is changed
toCurrecy.addEventListener('change', event => {
  resultTo = `${event.target.value}`;
});

searchBox.addEventListener('input', updateValue);

// Function for updating value
function updateValue(e) {
  searchValue = e.target.value;
}

// When user clicks, it calls function getresults
// convertBtn.addEventListener("click", getResults);

// Function getresults
function getResults() {
  controller = new AbortController();
  const signal = controller.signal;
  // const response = await fetch(API_URL, {signal})

  // const body = await response.text();
  //   const json = JSON.parse(body.replace(/^.+?\n/, ""));

  fetch(API_URL + resultFrom, { signal })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
      }
      const data = response.json();
      console.log(data);
      return data;
    })
    .then(displayResults)
    .catch(error => {
      console.log('Error:', error.message);
    });
}

// Display results after conversion
function displayResults(currency) {
  let fromRate = currency.rates[resultFrom];
  let toRate = currency.rates[resultTo];
  const jpf = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  });
  const enf = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const twf = new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 2,
    roundingIncrement: 5,
  });
  const amountNum = (toRate / fromRate) * searchValue;
  const twNum = twf.format(amountNum);
  if (resultFrom === 'JPY') {
    const jpNum = jpf.format(searchValue);
    display_text = `${jpNum} = ${twNum}`;
  } else if (resultFrom === 'USD') {
    const enNum = enf.format(searchValue);
    display_text = `${enNum} = ${twNum}`;
  } else {
    display_text = `${searchValue} ${resultFrom} = ${twNum}`;
  }
  finalValue.innerHTML = display_text;
  finalAmount.style.display = 'block';
}

// When user click on reset button
function clearVal() {
  window.location.reload();
  document.getElementsByClassName('finalValue').innerHTML = '';
}

const selectElem = document.getElementById('select');
const pElem = document.getElementById('p');

const index = selectElem.selectedIndex;

const arrEl1 = selectElem[index].text;

pElem.textContent = `selectedIndex: ${arrEl1}`;

selectElem.addEventListener('change', event => {
  const index = `${event.target.value}`;

  pElem.textContent = `selectedIndex: ${index}`;
});

const table = document.getElementById('forecast-table');
const cells = table.getElementsByTagNameNS(
  'http://www.w3.org/1999/xhtml',
  'td'
);

for (const cell of cells) {
  const axis = cell.getAttribute('axis');
  if (axis === 'year') {
    // Grab the data
  }
}
