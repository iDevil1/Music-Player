let title = document.querySelector(".title");
let audio = document.querySelector("audio");
let previous = document.querySelector(".previous");
let next = document.querySelector(".next");
let play = document.querySelector(".play");
let repeat = document.querySelector(".repeat");
let mute = document.querySelector(".mute");
let input = document.querySelector("input");
let timeProgress = document.querySelector(".time-progress");
let audioDurtaionLength = document.querySelector(".audio-duration");
let selectedTime = document.querySelector(".selected-time");
let playList = document.querySelector(".playlist");
let ifTrue = true;
let index = 0;

function getAudio() {
  const input = document.querySelector(".file");
  const audio = document.querySelector("audio");
  input.onchange = (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
      songs.push(e.target.result);
      titles.push(
        file.name.charAt(0).toUpperCase() +
          file.name.slice(1).replace(".mp3", "")
      );
      createElement();
    });
    reader.readAsDataURL(file);
  };
}
getAudio();

let titles = [
  "Øfdream - Thelema",
  "After Dark",
  "Suffer with me",
  "After Dark x Sweater weather",
  "The neighborhood - softcore",
];

title.innerText = titles[index];

let songs = [
  "./songs/Øfdream.mp3",
  "./songs/after dark.mp3",
  "./songs/suffer wiith me.mp3",
  "./songs/after dark x sweater weather sped up.mp3",
  "./songs/the neighbourhood - softcore sped up.mp3",
];

audio.src = songs[index];

function createElement() {
  document.querySelectorAll(".playlist-song").forEach((div) => div.remove());
  document
    .querySelectorAll(".playlist-play-song-btn")
    .forEach((div) => div.remove());
  for (let i = 0; i < songs.length; i++) {
    let div = document.createElement("div");
    let playBtn = document.createElement("button");
    playBtn.innerText = "play";

    div.innerText = titles[i];
    div.classList.add("playlist-song");
    playBtn.classList.add("playlist-play-song-btn");
    div.setAttribute("src", songs[i]);
    playBtn.onclick = () => {
      id = songs.indexOf(div.getAttribute("src"));
      index = id;
      title.innerText = titles[id];
      audio.src = songs[id];

      play.click();
    };
    playList.append(playBtn);
    playList.append(div);
    console.log(div);
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

let number;
function interval() {
  if (ifTrue) {
    let minutes = Math.floor(audio.currentTime / 60);
    let seconds = Math.floor(audio.currentTime - minutes * 60);
    timeProgress.innerText =
      seconds < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
    number = (Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100;

    input.value = Math.floor(number);
  }
}

previous.onclick = () => {
  if (index > 0 && index <= songs.length - 1) {
    index = index - 1;
    title.innerText = titles[index];
    audio.src = songs[index];
    audio.play();
    input.value = 0;
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
  audio.muted = false;
  audio.loop = false;
};

audio.onended = () => {
  next.click();
};

next.onclick = () => {
  if (index >= 0 && index < songs.length - 1) {
    index = index + 1;
    title.innerText = titles[index];
    audio.src = songs[index];
    audio.play();
    input.value = 0;
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
  audio.muted = false;
  audio.loop = false;
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
  } else {
    audio.pause();
    audio.addEventListener("timeupdate", () => {
      return;
    });
  }
};

repeat.onclick = () => {
  if (audio.loop !== true) {
    audio.loop = true;
  } else {
    audio.loop = false;
  }
};

mute.onclick = () => {
  if (audio.muted !== true) {
    audio.muted = true;
  } else {
    audio.muted = false;
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

input.onmousedown = () => {
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

// function fetch(url) {
//   return new Promise((resolve, reject) => {
//     var request = new XMLHttpRequest();
//     request.open("GET", url, true);
//     request.responseType = "arraybuffer";
//     let num_channels = 2;
//     let bitrate = 192000;
//     let sample_rate = 44100;
//     let byte_per_sec = 144 * (bitrate / sample_rate) * 38.28;
//     let range_from = Math.floor(byte_per_sec * 306.6);
//     let range_length = Math.floor(byte_per_sec * 5.2);
//     let range_to = range_from + (range_length - 1);
//     request.setRequestHeader("Range", "bytes=" + range_from + "-" + range_to);
//     request.onload = function () {
//       let arrayBuffer = request.response;
//       let byteArray = new Uint8Array(arrayBuffer);
//       //******************
//       for (let i = 0; i < byteArray.length; i += 1) {
//         if (
//           byteArray[i] === 0b11111111 &&
//           (byteArray[i + 1] & 0b11110000) === 0b11110000
//         ) {
//           log("we have a winner! Frame header at:" + i, true);
//           console.log(parseInt(byteArray[i], 10).toString(2)); //frame header 4 bytes
//           console.log(parseInt(byteArray[i + 1], 10).toString(2));
//           console.log(parseInt(byteArray[i + 2], 10).toString(2));
//           console.log(parseInt(byteArray[i + 3], 10).toString(2));
//           resolve(arrayBuffer.slice(i));
//           break;
//         }
//       }
//       //******************
//     };
//     request.send();
//   });
// }
// fetch(
//   "https://soundcloud.com/dangelo-kinzer-552886119/what-a-day-x-home-resonance?si=71f394150c1e4ddaa98f7859b8647d91&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
// );

// const axios = require("axios");
// const cheerio = require("cheerio");
// const fs = require("fs");
// const path = require("path");

// const websiteUrl =
//   "https://soundcloud.com/dangelo-kinzer-552886119/what-a-day-x-home-resonance?si=71f394150c1e4ddaa98f7859b8647d91&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"; // Replace with the website URL you want to scrape
// const outputDirectory = "downloaded_audio";

// axios
//   .get(websiteUrl)
//   .then((response) => {
//     const html = response.data;
//     const $ = cheerio.load(html);

//     // Identify audio file links (change the selector based on the website structure)
//     const audioLinks = $("audio source")
//       .map((_, element) => $(element).attr("src"))
//       .get();

//     // Download audio files
//     audioLinks.forEach(async (audioLink, index) => {
//       const audioFileName = `audio_${index}.mp3`;
//       const audioFilePath = path.join(outputDirectory, audioFileName);

//       const response = await axios({
//         method: "get",
//         url: audioLink,
//         responseType: "stream",
//       });

//       response.data.pipe(fs.createWriteStream(audioFilePath));

//       response.data.on("end", () => {
//         console.log(`Downloaded: ${audioFileName}`);
//       });
//     });
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });