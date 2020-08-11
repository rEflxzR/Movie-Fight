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
    root: document.querySelector('.left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
    }
})
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('.right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    }
})


let leftMovie
let rightMovie

const onMovieSelect = async (movie, summaryElement, movieside) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'c17b9d2b',
            i: movie.imdbID
        }
    })

    summaryElement.innerHTML = movieTemplate(response.data)

    if(movieside=='left') {
        leftMovie = response.data
    }
    else {
        rightMovie = response.data
    }

    if(leftMovie && rightMovie) {
        movieComparision(leftMovie, rightMovie)
    }
}


const movieComparision = () => {
    let leftstats = document.querySelectorAll('#left-summary .notification')
    let rightstats = document.querySelectorAll('#right-summary .notification')
    leftstats.forEach((lstat, index) => {
        const rstat = rightstats[index]

        let leftstat = lstat.dataset.value
        let rightstat = rstat.dataset.value

        lstat.classList.remove('is-primary')
        rstat.classList.remove('is-primary')

        if( isNaN(Number(leftstat)) || isNaN(Number(rightstat)) ) {
            if(!isNaN(Number(leftstat))) {
                lstat.classList.add('is-success')
                rstat.classList.add('is-danger')
            }
            else if(!isNaN(Number(rightstat))) {
                rstat.classList.add('is-success')
                lstat.classList.add('is-danger')
            }
            else {
                rstat.classList.add('is-warning')
                lstat.classList.add('is-warning')
            }
        }
        else if(Number(leftstat)>Number(rightstat)) {
            lstat.classList.add('is-success')
            rstat.classList.add('is-danger')
        }
        else if(Number(leftstat)<Number(rightstat)) {
            rstat.classList.add('is-success')
            lstat.classList.add('is-danger')
        }
        else {
            rstat.classList.add('is-warning')
            lstat.classList.add('is-warning')
        }
    })
}


const movieTemplate = (moviedetail) => {

    const collection = Number(moviedetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
    const metascore = Number(moviedetail.Metascore)
    const imdbscore = Number(moviedetail.imdbRating)
    const votes = Number(moviedetail.imdbVotes.replace(/,/g, ''))
    const awards = moviedetail.Awards.split(' ').reduce((total, curr) => {
        if(isNaN(Number(curr))) {
            return total
        }
        return total + Number(curr)

    }, 0)


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

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${moviedetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${collection} class="notification is-primary">
            <p class="title">${moviedetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${moviedetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbscore} class="notification is-primary">
            <p class="title">${moviedetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${votes} class="notification is-primary">
            <p class="title">${moviedetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}