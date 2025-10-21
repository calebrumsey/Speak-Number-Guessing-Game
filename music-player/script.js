const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const loopBtn = document.getElementById('loop');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const artistEl = document.getElementById('artist');
const albumEl = document.getElementById('album');

const volumeSlider = document.getElementById('volumeSlider');




const songs = [
    {
        title: 'egyptian pools',
        artist: 'Jinsang',
        album: 'Meditation'
    },
    {
        title: 'greener grass',
        artist: 'DC the Don',
        album: 'greener grass'
    },
    {
        title: 'in your arms',
        artist: 'saib',
        album: 'in your arms'
    }
];

let songIndex = 2;

function loadSong(song) {
  title.innerText = song.title;
  artistEl.innerText = song.artist;
  albumEl.innerText = song.album;
  audio.src = `music/${song.title}.mp3`;
  cover.src = `images/${song.title}.jpg`;
  document.getElementById('blur-bg').style.backgroundImage = `url('images/${song.title}.jpg')`;
}

loadSong(songs[songIndex]);

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.replace('fa-play', 'fa-pause');
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.replace('fa-pause', 'fa-play');
  audio.pause();
}

playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  isPlaying ? pauseSong() : playSong();
});

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;
}

audio.addEventListener('timeupdate', updateProgress);

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
}

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextSong);

function swipeBackground(newImageUrl) {
  const currentBg = document.getElementById('blur-bg');
  const nextBg = document.getElementById('blur-bg-next');
  nextBg.style.backgroundImage = `url('${newImageUrl}')`;
  nextBg.style.left = '100vw'; // Reset position

  void nextBg.offsetWidth;

  currentBg.style.left = '-100vw';
  nextBg.style.left = '0';

  // After transition, swap images and reset positions
  setTimeout(() => {
    currentBg.style.backgroundImage = nextBg.style.backgroundImage;
    currentBg.style.left = '0';
    nextBg.style.left = '100vw';
  }, 600); // Match transition duration
}

loopBtn.addEventListener('click', () => {
  audio.loop = !audio.loop;
  
  loopBtn.classList.toggle('active');

  volumeSlider.addEventListener('input', function() {
  audio.volume = this.value;
})})