///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
const allPokemonUrl = process.env.POKEMONALL_API_URL
const nameSearchBaseUrl = process.env.C_BY_NAME_BASE_URL
//const Place = require('../models/place')

/////////////////////
// Create Router ////
/////////////////////
const router = express.Router()

////////////////////////////
// Routes + Controllers ////
////////////////////////////
// GET -> /pokemon/all
// gives us all pokemon in the api for an index
router.get('/all', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // we have to make our api call
    axios(allPokemonUrl)
        // if we get data, render an index page
        .then(apiRes => {
            console.log('this came back from the api: \n', apiRes.data.results)
            // apiRes.data is an array of pokemon objects
            // res.send(apiRes.data)
            //res.send(apiRes.data)
            res.render('pokemon/index', { pokemon: apiRes.data.results, username, userId, loggedIn})
        })
        // if something goes wrong, display an error page
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})

// GET -> /pokemon/:name
// API data show page -> least specific - goes under all more specific routes
// give us a specific country's details after searching with the name
router.get('/:name', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const pokeName = req.params.name
    // could use destructuring, but no need with one item
    // const { placeName } = req.params
    // make our api call
    axios(`${nameSearchBaseUrl}${pokeName}`)
        // render the results on a 'show' page: aka 'detail' page
        .then(apiRes => {
            console.log('this is apiRes.data: \n', apiRes.data)
            // a single poke is apiRes.data
            const foundPoke = apiRes.data
            //res.send(foundPoke)
            res.render('pokemon/show', { poke: foundPoke, username, loggedIn, userId })
        })
        // if we get an error, display the error
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})




/////////////////////
// Export Router ////
/////////////////////
module.exports = router