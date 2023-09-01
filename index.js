const url = "sintel.mp4";

const MDI_URL = "https://fonts.google.com/metadata/icons";
const MOCK_JSON =
  "https://my-json-server.typicode.com/nickburrows/picgo_assets/db";
const videoWrapper = document.querySelector(".videoWrapper");
const downloadBtn = document.querySelector(".download");
const abortBtn = document.querySelector(".abort");
const reports = document.querySelector(".reports");

const searchInput = document.querySelector("#search-input");
const accessBtn = document.querySelector(".access");
const fetchResult = document.querySelector(".fetch-result");
const fetchBtn = document.querySelector(".fetch");
const stopFetchBtn = document.querySelector(".stop-fetch");
const fetchMsg = document.querySelector(".fetch-message");
const respCode = document.querySelector(".resp-code");
const respText = document.querySelector(".resp-text");

let controller;
let progressAnim;
let animCount = 0;
let query = "";
let icons = null;

downloadBtn.addEventListener("click", fetchVideo);

abortBtn.addEventListener("click", () => {
  controller.abort();
  console.log("Download aborted");
  downloadBtn.classList.remove("hidden");
});

function fetchVideo() {
  controller = new AbortController();
  const signal = controller.signal;
  downloadBtn.classList.add("hidden");
  abortBtn.classList.remove("hidden");
  reports.textContent = "Video awaiting download...";
  fetch(url, { signal })
    .then((response) => {
      if (response.status === 200) {
        runAnimation();
        setTimeout(() => console.log("Body used: ", response.bodyUsed), 1);
        return response.blob();
      } else {
        throw new Error("Failed to fetch");
      }
    })
    .then((myBlob) => {
      const video = document.createElement("video");
      video.setAttribute("controls", "");
      video.src = URL.createObjectURL(myBlob);
      videoWrapper.appendChild(video);

      videoWrapper.classList.remove("hidden");
      abortBtn.classList.add("hidden");
      downloadBtn.classList.add("hidden");

      reports.textContent = "Video ready to play";
    })
    .catch((e) => {
      abortBtn.classList.add("hidden");
      downloadBtn.classList.remove("hidden");
      reports.textContent = "Download error: " + e.message;
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
          "Download occuring; waiting for video player to be constructed";
        break;
      case 1:
        reports.textContent =
          "Download occuring; waiting for video player to be constructed.";
        break;
      case 2:
        reports.textContent =
          "Download occuring; waiting for video player to be constructed..";
        break;
      case 3:
        reports.textContent =
          "Download occuring; waiting for video player to be constructed...";
        break;
    }
  }, 300);
}

fetchBtn.addEventListener("click", fetchIcons);

function mockJSON() {
  controller = new AbortController();
  const signal = controller.signal;
  fetch(MDI_URL, { signal })
    .then((response) => {
      console.log("response.type =", response.type);
      console.log("response.url =", response.url);
      console.log("response.userFinalURL =", response.useFinalURL);
      console.log("response.status =", response.status);
      console.log("response.ok =", response.ok);
      console.log("response.statusText =", response.statusText);
      console.log("response.headers =", response.headers);
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
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log("Error:", error.message);
    });
}
async function fetchIcons() {
  controller = new AbortController();
  const signal = controller.signal;

  const response = await fetch(MDI_URL, { signal });
  //   const response = await fetch(MOCK_JSON, { signal });
  const body = await response.text();
  const json = JSON.parse(body.replace(/^.+?\n/, ""));

  return json.icons.map((icon) => {
    const assets = json.families.map((family) => {
      const path = json.asset_url_pattern
        .replace("{family}", family.toLowerCase().replace(/\W+/g, ""))
        .replace("{icon}", icon.name)
        .replace("{version}", String(icon.version))
        .replace("{asset}", `${icon.sizes_px[0] ?? 24}px`);
      const url = `https://${json.host}/${path}.svg`;

      return { family, url };
    });

    return {
      categories: icon.categories.join(", "),
      codepoint: icon.codepoint.toString(16),
      name: icon.name,
      tags: icon.tags,
      assets,
    };
  });
}

function Access() {
  const s = searchInput.value;
  document.querySelector(".innerTest").innerHTML = s;
}


let enterEventCount = 0;
let leaveEventCount = 0;
const mouseTarget = document.getElementById("mouseTarget");
const unorderedList = document.getElementById("unorderedList");

mouseTarget.addEventListener("mouseenter", (e) => {
  mouseTarget.style.border = "5px dotted orange";
  mouseTarget.style.color = "#6b7280";
  enterEventCount++;
  addListItem(`This is mouseenter event ${enterEventCount}.`);
});

mouseTarget.addEventListener("mouseleave", (e) => {
  mouseTarget.style.border = "1px solid #f3f4f6";
  mouseTarget.style.color = "#ffffff";
  leaveEventCount++;
  addListItem(`This is mouseleave event ${leaveEventCount}.`);
});


function addListItem(text) {
  // Create a new text node using the supplied text
  const newTextNode = document.createTextNode(text);

  // Create a new li element
  const newListItem = document.createElement("li");

  // Add the text node to the li element
  newListItem.appendChild(newTextNode);

  // Add the newly created list item to list
  unorderedList.appendChild(newListItem);

}

// When true, moving the mouse draws on the canvas
let isDrawing = false;
let x = 0;
let y = 0;

const myPics = document.getElementById("myPics");
const context = myPics.getContext("2d");

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
myPics.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});

myPics.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    drawLine(context, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = "#f3f4f6";
  context.lineWidth = 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

// import { Modal } from 'flowbite'

const $modalElement = document.querySelector('#modalEl');

const modalOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    onHide: () => {
        console.log('modal is hidden');
    },
    onShow: () => {
        console.log('modal is shown');
    },
    onToggle: () => {
        console.log('modal has been toggled');
    }
}

const modal = new Modal($modalElement, modalOptions);

modal.show();