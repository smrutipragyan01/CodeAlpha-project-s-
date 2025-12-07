/**
 * Human-written music player JS
 * - Edit the playlist array below to add your songs.
 * - Each item: { title, artist, src, cover }.
 * - Put actual MP3 files and images in the media/ folder or adjust the paths.
 */

(function () {
  'use strict';

  // ---------- Playlist: edit paths to match your files ----------
  const playlist = [
  { 
    title: 'HIGH ON YOU', 
    artist: 'Jind Universe', 
    src: 'music/HIGH_ON_YOU.mp3', 
    cover: 'img/HOY.png' 
  },
  { 
    title: 'Pal Pal',  
        artist: 'Afusic,Talwiinder,AliSoomroMusic', 
        src: 'music/PAL_PAL.mp3',
         cover: 'img/Pal.png'
         },
  { 
    title: 'Barbaad',   
       artist: 'Jubin Nautiyal,The Rish', 
       src: 'music/Barbaad.mp3',
         cover: 'img/barbaad.png'
         }
];

  // -------------------------------------------------------------

  // Elements
  const audio = document.getElementById('audio');
  const coverEl = document.getElementById('cover');
  const titleEl = document.getElementById('title');
  const artistEl = document.getElementById('artist');
  const playBtn = document.getElementById('play');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const progressContainer = document.getElementById('progressContainer');
  const progressEl = document.getElementById('progress');
  const volumeRange = document.getElementById('volume');
  const autoplayCheckbox = document.getElementById('autoplay');
  const playlistEl = document.getElementById('playlist');

  let currentIndex = 0;
  let isPlaying = false;

  // Build playlist UI
  function renderPlaylist() {
    playlistEl.innerHTML = '';
    playlist.forEach((song, i) => {
      const li = document.createElement('li');
      li.dataset.index = i;
      li.tabIndex = 0;

      li.innerHTML = `
        <div class="pl-cover"><img src="${song.cover}" alt="${song.title} cover" style="width:100%;height:100%;object-fit:cover"></div>
        <div class="pl-info">
          <div class="pl-title">${song.title}</div>
          <div class="pl-artist">${song.artist}</div>
        </div>
      `;
      li.addEventListener('click', () => loadSong(i, true));
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter') loadSong(i, true); });
      playlistEl.appendChild(li);
    });
    highlightActive();
  }

  // Load a song by index; if playNow true -> start playing
  function loadSong(index, playNow = false) {
  if (index < 0) index = playlist.length - 1;
  if (index >= playlist.length) index = 0;
  currentIndex = index;
  const s = playlist[currentIndex];

  // Use relative paths in playlist (see below). encodeURI handles spaces/()
  audio.src = encodeURI(s.src);
  titleEl.textContent = s.title || 'Unknown title';
  artistEl.textContent = s.artist || 'Unknown artist';

  // set cover src (single <img id="cover">)
  coverEl.src = s.cover ? encodeURI(s.cover) : 'img/cover-placeholder.jpg';

  audio.load();
  highlightActive();
  updateDurationAfterLoad();

  audio.onerror = (ev) => {
    console.error('Audio load error:', audio.src, ev);
    const msg = document.getElementById('formMsg');
    if (msg) msg.textContent = `Error loading audio for "${s.title}". Check path or file.`;
  };

  coverEl.onerror = () => {
    console.warn('Cover failed to load:', coverEl.src);
    coverEl.src = 'img/cover-placeholder.jpg';
  };

  if (playNow) play(); else pause();
}

  // Play / Pause
  function play() {
    audio.play().then(() => {
      isPlaying = true;
      playBtn.textContent = '⏸';
      playBtn.title = 'Pause';
    }).catch((err) => {
      // playback might be blocked (autoplay policies) — fallback UI only
      isPlaying = false;
      playBtn.textContent = '▶️';
      console.warn('Playback failed:', err);
    });
  }
  function pause() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = '▶️';
    playBtn.title = 'Play';
  }

  // Prev / Next
  function prev() {
    loadSong(currentIndex - 1, true);
  }
  function next() {
    loadSong(currentIndex + 1, true);
  }

  // Update progress UI
  function updateProgress() {
    if (audio.duration && !isNaN(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressEl.style.width = percent + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    } else {
      currentTimeEl.textContent = '0:00';
      progressEl.style.width = '0%';
    }
  }

  // Click to seek
  function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    if (audio.duration) audio.currentTime = pct * audio.duration;
    updateProgress();
  }

  // Update duration text after metadata loaded
  function updateDurationAfterLoad() {
    // clear duration until metadata available
    durationEl.textContent = '0:00';
    audio.addEventListener('loadedmetadata', function once() {
      durationEl.textContent = formatTime(audio.duration);
      audio.removeEventListener('loadedmetadata', once);
    });
  }

  // Format seconds -> m:ss
  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const s = Math.floor(sec % 60);
    const m = Math.floor(sec / 60);
    return m + ':' + (s < 10 ? '0' + s : s);
  }

  // Highlight the active playlist item
  function highlightActive() {
    playlistEl.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    const active = playlistEl.querySelector(`li[data-index="${currentIndex}"]`);
    if (active) active.classList.add('active');
  }

  // Wire events
  function wireEvents() {
    playBtn.addEventListener('click', () => {
      if (isPlaying) pause(); else play();
    });
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
      if (autoplayCheckbox.checked) {
        next();
      } else {
        pause();
        audio.currentTime = 0;
      }
    });

    // progress interaction: click to seek
    progressContainer.addEventListener('click', seek);

    // allow keyboard seeking when progress has focus (left/right)
    progressContainer.addEventListener('keydown', (e) => {
      if (!audio.duration) return;
      const step = Math.max(1, Math.floor(audio.duration * 0.05)); // 5% steps
      if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + step);
      if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - step);
    });

    // volume
    volumeRange.addEventListener('input', (e) => {
      audio.volume = parseFloat(e.target.value);
    });

    // autoplay default (unchecked)
    autoplayCheckbox.checked = false;

    // keyboard: space toggles play/pause when not focused in form fields
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement.tagName.toLowerCase();
      if (e.code === 'Space' && activeTag !== 'input' && activeTag !== 'textarea') {
        e.preventDefault();
        if (isPlaying) pause(); else play();
      }
    });
  }

  // init
  function init() {
    renderPlaylist();
    wireEvents();
    // set initial volume
    audio.volume = parseFloat(volumeRange.value);
    // load first song but do not autoplay (unless browser allows)
    loadSong(0, false);
  }

  // Run
  init();

  // Expose for debugging (optional)
  window.__player = {
    loadSong, play, pause, next, prev, playlist
  };

})();
