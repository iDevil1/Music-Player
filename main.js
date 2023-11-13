let title = document.querySelector(".title");
let audio = document.querySelector("audio");
let previous = document.querySelector(".previous");
let next = document.querySelector(".next");
let play = document.querySelector(".play");
let repeat = document.querySelector(".repeat");
let mute = document.querySelector(".mute");
let input = document.querySelector(".audio-input");
let volumeInput = document.querySelector(".volume-input");
let file = document.querySelector(".file");
let timeProgress = document.querySelector(".time-progress");
let audioDurtaionLength = document.querySelector(".audio-duration");
let selectedTime = document.querySelector(".selected-time");
let playList = document.querySelector(".playlist");

let ifTrue = true;
let index = 0;
let ifTrue2 = true;

function getAudio() {
  const input = document.querySelector(".file");
  input.onchange = (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
      if (file.type.includes("audio")) {
        songs.push(e.target.result);
        if (file.name.slice(1).includes(".wav")) {
          titles.push(
            file.name.charAt(0).toUpperCase() +
              file.name.slice(1).replace(".wav", "")
          );
        } else if (file.name.slice(1).includes(".mp3")) {
          titles.push(
            file.name.charAt(0).toUpperCase() +
              file.name.slice(1).replace(".mp3", "")
          );
        }
        createElement();
        if (!audio.paused) {
          console.log(
            document
              .querySelectorAll(".playlist-play-song-btn svg path")
              [index].setAttribute("d", play.getAttribute("data-pause"))
          );
        }
      }
    });
    reader.readAsDataURL(file);
  };
}
getAudio();

let titles = [
  "Resonance",
  "Øfdream - Thelema",
  "After Dark",
  "Suffer with me",
  "The neighborhood - softcore",
];

title.innerText = titles[index];

let songs = [
  "./songs/Resonance.mp3",
  "./songs/Øfdream.mp3",
  "./songs/after dark.mp3",
  "./songs/suffer wiith me.mp3",
  "./songs/the neighbourhood - softcore sped up.mp3",
];

audio.src = songs[index];

function createElement() {
  document.querySelectorAll(".div-container").forEach((div) => div.remove());
  document.querySelectorAll(".playlist-song").forEach((div) => div.remove());
  document
    .querySelectorAll(".playlist-play-song-btn")
    .forEach((div) => div.remove());

  for (let i = 0; i < songs.length; i++) {
    let divContainer = document.createElement("div");
    let div = document.createElement("div");
    let playBtn = document.createElement("button");
    let svgClone = play.querySelector("svg");
    let svg = svgClone.cloneNode(true);

    div.innerText = titles[i];

    divContainer.classList.add("div-container");
    div.classList.add("playlist-song");
    playBtn.classList.add("playlist-play-song-btn");

    playBtn.setAttribute("src", songs[i]);
    playBtn.setAttribute("title", titles[i]);

    playBtn.append(svg);
    divContainer.append(playBtn);
    divContainer.append(div);
    playList.append(divContainer);

    var isPlaying = true;
    let array = [];
    document
      .querySelectorAll(".playlist-play-song-btn svg path")
      .forEach((path) => {
        path.setAttribute("d", play.getAttribute("data-play"));
      });

    document.querySelectorAll(".playlist-play-song-btn").forEach((btn) => {
      btn.onclick = (e) => {
        number = 0;
        let playSrc = btn.getAttribute("src");
        let playIndex = songs.indexOf(playSrc);
        index = playIndex;
        array.push(playIndex);

        if (playIndex !== -1) {
          if (isPlaying) {
            if (title.innerText != btn.getAttribute("title")) {
              // Set the new audio source
              audio.src = songs[playIndex];

              // Load and play the new audio source
              audio.load();

              // Update the title or other relevant UI elements
              title.innerText = titles[playIndex];
            }

            isPlaying = false;
          }
        }

        audio.addEventListener("ended", () => {
          isPlaying = false;
        });

        if (array.length > 1) {
          if (array[array.length - 2] != array[array.length - 1]) {
            if (title.innerText != btn.getAttribute("title")) {
              audio.src = songs[playIndex];
              title.innerText = titles[playIndex];
            }
            ifTrue2 = true;
          }
        }

        if (audio.paused && ifTrue2) {
          audio.play();
          ifTrue2 = false;
          play
            .querySelector("svg path")
            .setAttribute("d", play.getAttribute("data-pause"));
          document
            .querySelectorAll(".playlist-play-song-btn svg path")
            .forEach((path) =>
              path.setAttribute("d", play.getAttribute("data-play"))
            );
          btn
            .querySelector("svg path")
            .setAttribute("d", play.getAttribute("data-pause"));
          btn.setAttribute("play-state", true);
        } else {
          audio.pause();
          ifTrue2 = true;
          play
            .querySelector("svg path")
            .setAttribute("d", play.getAttribute("data-play"));
          btn
            .querySelector("svg path")
            .setAttribute("d", play.getAttribute("data-play"));
          btn.setAttribute("play-state", false);
        }
        audio.addEventListener("timeupdate", () => {
          interval();
        });

        audioDurtaion(songs[playIndex], (duration) => {
          let minutes = Math.floor(duration / 60);
          let seconds = Math.floor(duration - minutes * 60);
          if (seconds < 10) {
            audioDurtaionLength.innerText = minutes + ":0" + seconds;
          } else {
            audioDurtaionLength.innerText = minutes + ":" + seconds;
          }
        });
      };
    });
  }
}
createElement();

function audioDurtaion(src, duration) {
  var audio = new Audio();
  audio.onloadedmetadata = () => {
    duration(audio.duration);
  };
  audio.src = src;
}

audioDurtaion(songs[index], (duration) => {
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration - minutes * 60);
  if (seconds < 10) {
    audioDurtaionLength.innerText = minutes + ":0" + seconds;
  } else {
    audioDurtaionLength.innerText = minutes + ":" + seconds;
  }
});

let number = 0;
function interval() {
  if (ifTrue) {
    let minutes = Math.floor(audio.currentTime / 60);
    let seconds = Math.floor(audio.currentTime - minutes * 60);
    timeProgress.innerText =
      seconds < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;

    if (!isNaN(audio.duration)) {
      number =
        (Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100;
    }

    input.value = Math.floor(number);
  }
}

previous.onclick = () => {
  if (index > 0 && index <= songs.length - 1) {
    audio.currentTime = 0;
    input.value = 0;
    number = 0;
    index = index - 1;
    title.innerText = titles[index];
    audio.src = songs[index];
    audio.play();
  }

  audioDurtaion(songs[index], (duration) => {
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration - minutes * 60);
    if (seconds < 10) {
      audioDurtaionLength.innerText = minutes + ":0" + seconds;
    } else {
      audioDurtaionLength.innerText = minutes + ":" + seconds;
    }
  });

  audio.addEventListener("timeupdate", () => {
    interval();
  });

  play
    .querySelector("svg path")
    .setAttribute("d", play.getAttribute("data-pause"));
  document
    .querySelectorAll(".playlist-play-song-btn svg path")
    .forEach((path) => path.setAttribute("d", play.getAttribute("data-play")));
  document
    .querySelectorAll(".playlist-play-song-btn svg path")
    [index].setAttribute("d", play.getAttribute("data-pause"));
};

audio.onended = () => {
  next.click();
};

next.onclick = () => {
  if (index >= 0 && index < songs.length - 1) {
    audio.currentTime = 0;
    input.value = 0;
    number = 0;
    index = index + 1;
    title.innerText = titles[index];
    audio.src = songs[index];
    audio.play();
  }

  audioDurtaion(songs[index], (duration) => {
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration - minutes * 60);
    if (seconds < 10) {
      audioDurtaionLength.innerText = minutes + ":0" + seconds;
    } else {
      audioDurtaionLength.innerText = minutes + ":" + seconds;
    }
  });

  audio.addEventListener("timeupdate", () => {
    interval();
  });

  play
    .querySelector("svg path")
    .setAttribute("d", play.getAttribute("data-pause"));
  document
    .querySelectorAll(".playlist-play-song-btn svg path")
    .forEach((path) => path.setAttribute("d", play.getAttribute("data-play")));
  document
    .querySelectorAll(".playlist-play-song-btn svg path")
    [index].setAttribute("d", play.getAttribute("data-pause"));
};

play.onclick = () => {
  if (audio.paused) {
    audio.play();

    audio.addEventListener("timeupdate", () => {
      interval();
    });

    audioDurtaion(songs[index], (duration) => {
      let minutes = Math.floor(duration / 60);
      let seconds = Math.floor(duration - minutes * 60);
      if (seconds < 10) {
        audioDurtaionLength.innerText = minutes + ":0" + seconds;
      } else {
        audioDurtaionLength.innerText = minutes + ":" + seconds;
      }
    });

    play
      .querySelector("svg path")
      .setAttribute("d", play.getAttribute("data-pause"));

    document
      .querySelectorAll(".playlist-play-song-btn svg path")
      [index].setAttribute("d", play.getAttribute("data-pause"));
  } else {
    audio.pause();

    audio.addEventListener("timeupdate", () => {
      return;
    });

    play
      .querySelector("svg path")
      .setAttribute("d", play.getAttribute("data-play"));

    document
      .querySelectorAll(".playlist-play-song-btn svg path")
      [index].setAttribute("d", play.getAttribute("data-play"));
  }
};

repeat.onclick = () => {
  if (audio.loop !== true) {
    audio.loop = true;
    repeat.querySelectorAll("svg path").forEach((path) => {
      path.style.fill = "lime";
    });
  } else {
    audio.loop = false;
    repeat.querySelectorAll("svg path").forEach((path) => {
      path.style.fill = "black";
    });
  }
};

mute.onclick = () => {
  if (audio.muted !== true) {
    audio.muted = true;
    volumeInput.value = 0;

    mute.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="500" height="500" viewBox="0 0 75 75" stroke="#111" stroke-width="5">
        <path d="m39,14-17,15H6V48H22l17,15z" fill="#111" stroke-linejoin="round"/>
        <path d="m49,26 20,24m0-24-20,24" fill="none" stroke-linecap="round"/>
        </svg>
     `;
  } else {
    audio.muted = false;
    volumeInput.value = audio.volume * 100;
    if (volumeInput.value <= 70 && volumeInput.value >= 40) {
      mute.querySelector("svg").innerHTML = `<path
    d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
    style="
      stroke: #111;
      stroke-width: 5;
      stroke-linejoin: round;
      fill: #111;
    "
   />
   <path
    d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,"
    style="
      fill: none;
      stroke: #111;
      stroke-width: 5;
      stroke-linecap: round;
    "
   />`;
    } else if (volumeInput.value <= 40 && volumeInput.value >= 1) {
      mute.querySelector("svg").innerHTML = `
    <path
    d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
    style="
      stroke: #111;
      stroke-width: 5;
      stroke-linejoin: round;
      fill: #111;
    "
  />
  <path
    d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0"
    style="
      fill: none;
      stroke: #111;
      stroke-width: 5;
      stroke-linecap: round;
    "
  />`;
    } else {
      mute.querySelector("svg").innerHTML = `
        <path
          d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
          style="
          stroke: #111;
          stroke-width: 5;
          stroke-linejoin: round;
          fill: #111;
        "
        />
        <path
          d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
          style="
          fill: none;
          stroke: #111;
          stroke-width: 5;
          stroke-linecap: round;
        "
        />
      `;
    }
  }
};

input.onchange = () => {
  let value = input.value / 100;
  audioDurtaion(songs[index], (duration) => {
    let rangeValue = value * duration;
    audio.currentTime = rangeValue;
  });
};

input.oninput = (e) => {
  let value = input.value / 100;
  audioDurtaion(songs[index], (duration) => {
    let rangeValue = value * duration;
    minutes = Math.floor(rangeValue / 60);
    seconds = Math.floor(rangeValue - minutes * 60);
    timeProgress.innerText =
      seconds < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
  });
};

input.ontouchend = () => {
  mouseUp();
};

input.onmousedown = () => {
  mouseDown();
};

input.ontouchstart = () => {
  mouseDown();
};

document.body.addEventListener("mouseup", mouseUp);

var mouseTimer;

function mouseDown() {
  mouseUp();
  mouseTimer = window.setTimeout(execMouseDown, 2000); //set timeout to fire in 2 seconds when the user presses mouse button down
  ifTrue = false;
}

function mouseUp() {
  if (mouseTimer) window.clearTimeout(mouseTimer); //cancel timer when mouse button is released
  ifTrue = true;
}

function execMouseDown() {
  let value = input.value / 100;
  audioDurtaion(songs[index], (duration) => {
    let rangeValue = value * duration;
    minutes = Math.floor(rangeValue / 60);
    seconds = Math.floor(rangeValue - minutes * 60);
    timeProgress.innerText =
      seconds < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
  });
}

volumeInput.oninput = () => {
  audio.volume = volumeInput.value / 100;
  if (audio.volume != 0) {
    audio.muted = false;
  }

  if (volumeInput.value <= 70 && volumeInput.value >= 40) {
    mute.querySelector("svg").innerHTML = `<path
    d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
    style="
      stroke: #111;
      stroke-width: 5;
      stroke-linejoin: round;
      fill: #111;
    "
   />
   <path
    d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,"
    style="
      fill: none;
      stroke: #111;
      stroke-width: 5;
      stroke-linecap: round;
    "
   />`;
  } else if (volumeInput.value <= 40 && volumeInput.value >= 1) {
    mute.querySelector("svg").innerHTML = `
    <path
    d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
    style="
      stroke: #111;
      stroke-width: 5;
      stroke-linejoin: round;
      fill: #111;
    "
  />
  <path
    d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0"
    style="
      fill: none;
      stroke: #111;
      stroke-width: 5;
      stroke-linecap: round;
    "
  />`;
  } else if (volumeInput.value == 0) {
    mute.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="500" height="500" viewBox="0 0 75 75" stroke="#111" stroke-width="5">
    <path d="m39,14-17,15H6V48H22l17,15z" fill="#111" stroke-linejoin="round"/>
    <path d="m49,26 20,24m0-24-20,24" fill="none" stroke-linecap="round"/>
    </svg>
 `;
  } else {
    mute.querySelector("svg").innerHTML = `
        <path
          d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
          style="
          stroke: #111;
          stroke-width: 5;
          stroke-linejoin: round;
          fill: #111;
        "
        />
        <path
          d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
          style="
          fill: none;
          stroke: #111;
          stroke-width: 5;
          stroke-linecap: round;
        "
        />
      `;
  }
};
