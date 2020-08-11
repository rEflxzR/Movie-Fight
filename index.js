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

const autoCompleteConfig = {
    renderOption(movie) {
        const imgsrc = movie.Poster === "N/A" ? "" : movie.Poster
        return `<img src="${imgsrc}" />
        ${movie.Title} (${movie.Year})`
    },
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie)
    },
    inputValue(movie) {
        return movie.Title
    },
    async fetchData(searchterm) {
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
}


createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('.left-autocomplete')
})
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('.right-autocomplete')
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