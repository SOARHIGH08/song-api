const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");

const seekSlider = document.getElementById("seek-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");
const audioPlayer = document.getElementById("audioPlayer");

let isPlaying = false;
let currentTime = 0;
const maxTime = 613;
const totalTimeInSeconds = 613;

const lyricsBtn = document.getElementById("lyrics-btn");
const albumBtn = document.getElementById("albums-btn");
const artistBtn = document.getElementById("artist-btn");

const lyricsContainer = document.getElementById("lyrics");
const albumsContainer = document.getElementById("albums");
const artistContainer = document.getElementById("artist");

const ApiKey = "cd56ffcdb6msh082598360d0b22bp1e7851jsn0126fc2639fe";
const ApiLyricsHost = "genius-song-lyrics1.p.rapidapi.com";
const ApiSpotifyHost = "spotify23.p.rapidapi.com";

const artist_lyrics_id = "6688199";
const artist_spotify_id = "06HL4z0CvFAxyc27GXpf02";

document.addEventListener("DOMContentLoaded", function () {
  stopBtn.classList.add("animate");
  stopBtn.style.display = "none";

  fetchLyrics();
});

function updateSeekBar() {
  if (isPlaying) {
    currentTime += 1;
    if (currentTime > maxTime) {
      currentTime = 0;
      stopSong();
    }
    seekSlider.value = currentTime;
    seekSlider.max = maxTime;
    updateTimeDisplay(currentTime);
    requestAnimationFrame(updateSeekBar);
  }
}

function updateTimeDisplay(currentTime) {
  const currentMinutes = Math.floor(
    ((currentTime / maxTime) * totalTimeInSeconds) / 60
  );
  const currentSeconds = Math.floor(
    ((currentTime / maxTime) * totalTimeInSeconds) % 60
  );
  currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds
    .toString()
    .padStart(2, "0")}`;
}

function playSong(url) {
  if (!isPlaying) {
    isPlaying = true;
    requestAnimationFrame(updateSeekBar);
  }

  stopBtn.classList.remove("animate");
  playBtn.classList.add("animate");
  setTimeout(() => {
    playBtn.style.display = "none";
    stopBtn.style.display = "block";
  }, 100);

  audioPlayer.src = url;
  audioPlayer.play();
}

function stopSong() {
  isPlaying = false;
  playBtn.classList.remove("animate");
  stopBtn.classList.add("animate");
  setTimeout(() => {
    playBtn.style.display = "block";
    stopBtn.style.display = "none";
  }, 100);
}

function seekTo(value) {
  currentTime = parseInt(value, 10);
  updateTimeDisplay(currentTime);
}

playBtn.addEventListener("click", playSong);
stopBtn.addEventListener("click", stopSong);
lyricsBtn.addEventListener("click", fetchLyrics);
albumBtn.addEventListener("click", fetchAlbum);
artistBtn.addEventListener("click", fetchArtist);

// LYRICS
async function fetchLyrics() {
  lyricsBtn.disabled = true;
  albumBtn.disabled = false;
  artistBtn.disabled = false;

  lyricsContainer.classList.remove("hide");
  albumsContainer.classList.add("hide");
  artistContainer.classList.add("hide");
  lyricsContainer.innerHTML = "<h3>Fetching lyrics...</h3>";

  const url = `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${artist_lyrics_id}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": ApiKey,
      "X-RapidAPI-Host": ApiLyricsHost,
    },
  };

  try {
    const response = await fetch(url, options);

    const lyricsData = await response.json();

    const lyrics = lyricsData.lyrics.lyrics.body.html;
    const title = lyricsData.lyrics.tracking_data.title;
    console.log(lyrics);
    lyricsContainer.innerHTML = lyrics;
  } catch (error) {
    lyricsContainer.innerHTML = "Failed to display lyrics, expired key.";
    console.error(error);
  }
}

// ALBUMS
async function fetchAlbum() {
  lyricsBtn.disabled = false;
  albumBtn.disabled = true;
  artistBtn.disabled = false;

  lyricsContainer.classList.add("hide");
  albumsContainer.classList.remove("hide");
  artistContainer.classList.add("hide");

  albumsContainer.innerHTML = "<h3>Fetching albums...</h3>";

  const url = `https://${ApiSpotifyHost}/artist_albums/?id=${artist_spotify_id}&offset=0&limit=100`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": ApiKey,
      "X-RapidAPI-Host": ApiSpotifyHost,
    },
  };

  try {
    const response = await fetch(url, options);

    albumsContainer.innerHTML = "";

    // Access the album data from albumsData
    const albums = albumsData.data.artist.discography.albums.items;

    const albumNames = albums
      .map((album) => album.releases.items)
      .flat()
      .map((item) => {
        const name = item.name;
        const url = item.sharingInfo.shareUrl;
        const image = item.coverArt.sources[0].url;
        return { name, url, image };
      });

    console.log(albumNames);

    albumNames.forEach((album) => {
      const albumElement = document.createElement("div");
      albumElement.classList.add("album-container");

      albumElement.innerHTML = `
    <div>
      <a href="${album.url}" target="_blank">
        <img src="${album.image}" alt="album image">
      </a>
      <p class="album-name">${album.name}</p>
    </div>
  `;
      albumsContainer.appendChild(albumElement);
    });
  } catch (error) {
    albumsContainer.innerHTML = "Failed to display albums, expired key.";
    console.error(error);
  }
}

//

// ARTIST
async function fetchArtist() {
  lyricsBtn.disabled = false;
  albumBtn.disabled = false;
  artistBtn.disabled = true;

  lyricsContainer.classList.add("hide");
  albumsContainer.classList.add("hide");
  artistContainer.classList.remove("hide");

  artistContainer.innerHTML = "<h3>Fetching artists...</h3>";

  const url = `https://${ApiSpotifyHost}/artist_related/?id=${artist_spotify_id}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": ApiKey,
      "X-RapidAPI-Host": ApiSpotifyHost,
    },
  };

  try {
    const response = await fetch(url, options);
    const artistData = await response.json();
    const artist = artistData;
    console.log(artist);

    artistContainer.innerHTML = "";

    for (let i = 0; i < artist.artists.length; i++) {
      const artistElement = document.createElement("div");
      const image = artist.artists[i].images[0].url;
      const name = artist.artists[i].name;
      const url = artist.artists[i].external_urls.spotify;

      artistElement.classList.add("artist-container");

      artistElement.innerHTML = `
        <div> <a href=${url} target="_blank">
          <img src="${image}" alt="artist image"></a>
          <p class="artist-name">${name}</p>
        </div>
      `;

      artistContainer.appendChild(artistElement);
    }
  } catch (error) {
    artistContainer.innerHTML = "Failed to display artists, expired key.";
    console.error(error);
  }
}
