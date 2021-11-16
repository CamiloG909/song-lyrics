const header = document.querySelector(".header .header__img");
const containerForm = document.querySelector(".search-song");
const form = document.querySelector("#search-song");
const title = document.querySelector(".container-index__title");
const lyricsContainer = document.querySelector(".song-lyrics");
const emptyFigure = document.querySelector(".song-lyrics__empty");

header.addEventListener("click", () => window.location.reload());
form.addEventListener("submit", searchSong);

class API {
	constructor(singer, song) {
		this.singer = singer;
		this.song = song;

		this.consultAPI();
	}

	consultAPI() {
		const URL = `https://api.lyrics.ovh/v1/${this.singer}/${this.song}`;

		fetch(URL)
			.then((response) => response.json())
			.then((data) => {
				if (data.error) {
					return this.showError(data.error);
				}
				this.showLyrics(data, this.singer, this.song);
			})
			.catch((error) => console.log(error));
	}

	showLyrics(data, artist, titleSong) {
		// Remove empty message
		if (lyricsContainer.querySelector(".song-lyrics__empty") !== null) {
			lyricsContainer.querySelector(".song-lyrics__empty").remove();
		} else {
			lyricsContainer.innerHTML = "";
		}

		const title = document.createElement("p");
		title.className = "song-lyrics__title";
		title.textContent = `${artist} - ${titleSong} Lyrics`;
		lyricsContainer.appendChild(title);

		let lyrics = JSON.stringify(data.lyrics).replace(/\\n/g, "<br>");
		lyrics = lyrics.replace(/\\r/g, " ");
		lyrics = lyrics.slice(1, -1);

		const lyricsText = document.createElement("div");
		lyricsText.className = "song-lyrics__text";
		lyricsText.innerHTML = lyrics;
		lyricsContainer.appendChild(lyricsText);

		const points = document.createElement("p");
		points.className = "song-lyrics__title";
		points.textContent = `...`;
		lyricsContainer.appendChild(points);
	}

	showError(error) {
		if (lyricsContainer.querySelector(".song-lyrics__title") !== null) {
			lyricsContainer.innerHTML = "";

			const figure = document.createElement("figure");
			figure.className = "song-lyrics__empty";
			figure.innerHTML = `<i class="bi bi-disc song-lyrics__empty-icon --error"></i>
			<p class="song-lyrics__empty-text --error">${error}</p>`;
			lyricsContainer.appendChild(figure);
		} else {
			emptyFigure.querySelector(".song-lyrics__empty-text").textContent = error;
			emptyFigure.querySelector("i").classList.add("--error");
			emptyFigure.querySelector("p").classList.add("--error");
		}
	}
}

function searchSong(e) {
	e.preventDefault();

	const singer = form.querySelector("#singer").value;
	const song = form.querySelector("#song").value;

	// Validate form
	if (singer === "" || song === "") {
		title.classList.add("--title-error");
		title.textContent = "Please fill all the fields";

		// Hidden error
		setTimeout(() => {
			title.classList.remove("--title-error");
			title.textContent = "Song lyrics";
		}, 1500);
		return;
	}

	// Obj song
	const search = new API(singer, song);
}
