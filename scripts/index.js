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