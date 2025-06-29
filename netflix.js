// Updated API key from TMDB
const api_key = "3db40bf937d52a53c31b7af7db6191ee";

// Base URL of the site
const base_url = "https://api.themoviedb.org/3";

const banner_url = "https://image.tmdb.org/t/p/original";
const img_url = "https://image.tmdb.org/t/p/w300";

// Initialize setMovie variable
let setMovie;

// Add a placeholder image URL
const placeholder_img = "https://via.placeholder.com/300x450?text=No+Image";

// Requests for movies data
const requests = {
    fetchTrending: `${base_url}/trending/all/week?api_key=${api_key}&language=en-US`,
    fetchNetflixOriginals: `${base_url}/discover/tv?api_key=${api_key}&with_networks=213`,
    fetchActionMovies: `${base_url}/discover/movie?api_key=${api_key}&with_genres=28`,
    fetchComedyMovies: `${base_url}/discover/movie?api_key=${api_key}&with_genres=35`,
    fetchHorrorMovies: `${base_url}/discover/movie?api_key=${api_key}&with_genres=27`,
    fetchRomanceMovies: `${base_url}/discover/movie?api_key=${api_key}&with_genres=10749`,
    fetchDocumentaries: `${base_url}/discover/movie?api_key=${api_key}&with_genres=99`,
};

// Used to truncate the string
function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

// banner
fetch(requests.fetchNetflixOriginals)
    .then((res) => res.json())
    .then((data) => {
        const results = data.results;
        setMovie = results[Math.floor(Math.random() * results.length - 1)];

        var banner = document.getElementById("banner");
        var banner_title = document.getElementById("banner_title");
        var banner_desc = document.getElementById("banner_description");

        banner.style.backgroundImage = `url(${banner_url}${setMovie.backdrop_path})`;
        banner_desc.innerText = truncate(setMovie.overview, 150);

        banner_title.innerText = setMovie.name;
    });

// Add search bar to the DOM
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav') || document.body;
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search movies...';
    searchBar.id = 'movieSearchBar';
    searchBar.style = 'margin: 20px; padding: 10px; width: 300px; font-size: 1rem;';
    nav.parentNode.insertBefore(searchBar, nav.nextSibling);
});

// Helper to create movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie_card';
    const img = document.createElement('img');
    img.className = 'row_posterLarge';
    img.src = movie.poster_path ? `${img_url}${movie.poster_path}` : placeholder_img;
    img.alt = movie.name || movie.title || 'Movie';
    card.appendChild(img);

    // Overlay for Play button and overview
    const overlay = document.createElement('div');
    overlay.className = 'movie_overlay';
    overlay.innerHTML = `
        <button class="play_button">Play</button>
        <p class="movie_overview">${truncate(movie.overview, 100)}</p>
    `;
    card.appendChild(overlay);

    // Movie name
    const name = document.createElement('p');
    name.className = 'movie_name';
    name.innerText = movie.name || movie.title || 'Untitled';
    card.appendChild(name);

    return card;
}

// Function to render a row
function renderRow(titleText, movies, rowClass = "row_posterLarge") {
    const headrow = document.getElementById("headrow");
    const row = document.createElement("div");
    row.className = "row";
    headrow.appendChild(row);
    const title = document.createElement("h2");
    title.className = "row_title";
    title.innerText = titleText;
    row.appendChild(title);
    const row_posters = document.createElement("div");
    row_posters.className = "row_posters";
    row.appendChild(row_posters);
    movies.forEach((movie) => {
        row_posters.appendChild(createMovieCard(movie));
    });
}

// Store all movies for search
let allMovies = [];

// Fetch and render all rows
Promise.all([
    fetch(requests.fetchNetflixOriginals).then(res => res.json()),
    fetch(requests.fetchTrending).then(res => res.json()),
    fetch(requests.fetchActionMovies).then(res => res.json()),
    fetch(requests.fetchComedyMovies).then(res => res.json()),
    fetch(requests.fetchHorrorMovies).then(res => res.json()),
    fetch(requests.fetchRomanceMovies).then(res => res.json()),
    fetch(requests.fetchDocumentaries).then(res => res.json()),
]).then(([originals, trending, action, comedy, horror, romance, documentaries]) => {
    document.getElementById("headrow").innerHTML = "";
    renderRow("NETFLIX ORIGINALS", originals.results);
    renderRow("Top Rated", trending.results);
    renderRow("Action Movies", action.results);
    renderRow("Comedy Movies", comedy.results);
    renderRow("Horror Movies", horror.results);
    renderRow("Romance Movies", romance.results);
    renderRow("Documentaries", documentaries.results);
    // Store all movies for search
    allMovies = [
        ...originals.results,
        ...trending.results,
        ...action.results,
        ...comedy.results,
        ...horror.results,
        ...romance.results,
        ...documentaries.results
    ];
});

// Search functionality
setTimeout(() => {
    const searchBar = document.getElementById('movieSearchBar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allMovies.filter(movie =>
                (movie.name || movie.title || '').toLowerCase().includes(query)
            );
            document.getElementById("headrow").innerHTML = "";
            renderRow(`Search Results for "${query}"`, filtered);
        });
    }
}, 1000);
