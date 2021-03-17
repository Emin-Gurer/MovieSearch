//Gettin DOM elements
const form = document.getElementById('form');
const tbody = document.getElementById('movie-list');
const showmylist = document.getElementById('showmylist');
//Movie Class
class Movie {
    constructor(Title, Year, Poster, imdbID, imdbRating) {
        this.Title = Title;
        this.Year = Year;
        this.Poster = Poster;
        this.imdbID = imdbID;
        this.imdbRating = imdbRating;
    }
}

//UI Class
class UI {
    static getImdbRat(IDs) {

        IDs.forEach((id, index) => {
            fetch('http://www.omdbapi.com/?apikey=e0e7f47c&i=' + id)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    const td = document.getElementById(`imdbIDs${index}`);
                    td.innerText = data.imdbRating;
                })
                .catch(e => {
                    console.log('this is error: ' + e)
                })
        })



    }

    static showMovies(movieArr) {
        const imdbIDs = [];
        movieArr.forEach(function (movie, index) {
            tbody.innerHTML += `<tr>
            <td><img src='${movie.Poster}'></td>
            <td id='imdbIDs${index}'></td>
            <td>${movie.Title}</td>
            <td>${movie.Year}</td>
            <td><button class="btn btn-primary add">Add to wathclist</button></td>
            </tr>
            `;
            imdbIDs.push(movie.imdbID);
        })
        UI.getImdbRat(imdbIDs)
    }

    static searchMovies(e) {
        e.preventDefault();
        const search = document.getElementById('search-name');
        tbody.innerHTML = '';
        fetch('http://www.omdbapi.com/?apikey=e0e7f47c&s=' + search.value)
            .then(res => {
                return res.json()
            })
            .then(data => {
                UI.showMovies(data.Search)
            })
            .catch(e => {
                console.log('error ' + e)
            })
    }
}


//Storage Class
class Storage {
    static getMyMovies() {
        if (localStorage.getItem('myMovies') == null) {
            return [];
        } else {
            return JSON.parse(localStorage.getItem('myMovies'));
        }

    }
    static setMyMovies(movie) {
        const myMovies = Storage.getMyMovies();
        myMovies.push(movie);
        localStorage.setItem('myMovies', JSON.stringify(myMovies))
    }
    static addMovieTolist(e) {
        if (e.target.classList.contains('add')) {
            const name = e.target.parentElement.previousElementSibling.previousElementSibling.innerText;
            const year = e.target.parentElement.previousElementSibling.innerText;
            const poster = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.src;
            const imdbID = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerText;
            const movie = new Movie(name, year, poster, imdbID);
            Storage.setMyMovies(movie);
        }
    }
}

//Events

form.addEventListener('submit', UI.searchMovies);
tbody.addEventListener('click', Storage.addMovieTolist);
showmylist.addEventListener('click', function () {
    tbody.innerHTML = '';
    UI.showMovies(Storage.getMyMovies());
})