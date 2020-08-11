const fetchData = async (searchterm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'c17b9d2b',
            s: searchterm
        }
    })

    if(response.data.Error) {
        return []
    }

    return response.data.Search
}


// INPUT BOXs

const root = document.querySelector('.autocomplete')

root.innerHTML = `
    <label><strong>Search for a Movie</strong></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`

const input = document.querySelector('input')
const dropdown = document.querySelector('.dropdown')
const result = document.querySelector('.results')


const onInput = async (event) => {
    const movies = await fetchData(event.target.value)

    if(!movies.length) {
        dropdown.classList.remove('is-active')
        return
    }
    
    result.innerHTML = ""
    dropdown.classList.add('is-active') 
    const dropdownmenu = document.querySelector('.dropdown-menu')
    dropdownmenu.style.width = '400px'

    for(let movie of movies) {
        const option = document.createElement('a')
        const imgsrc = movie.Poster === "N/A" ? "" : movie.Poster

        option.classList.add('dropdown-item')
        option.innerHTML = `
            <img src="${imgsrc}" />
            ${movie.Title}
        `
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active')
            input.value = movie.Title
            onMovieSelect(movie)
        })

        result.appendChild(option)
    }
}

input.addEventListener('input', debounce(onInput, 1000))

document.addEventListener('click', (event) => {
    if(!root.contains(event.target)) {
        dropdown.classList.remove('is-active')
    }
})


const onMovieSelect = async (movie) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'c17b9d2b',
            i: movie.imdbID
        }
    })

    document.querySelector("#summary").innerHTML = movieTemplate(response.data)
}

const movieTemplate = (moviedetail) => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${moviedetail.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${moviedetail.Title}</h1>
                    <h4>${moviedetail.Genre}</h4>
                    <p>${moviedetail.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${moviedetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${moviedetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${moviedetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${moviedetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${moviedetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}