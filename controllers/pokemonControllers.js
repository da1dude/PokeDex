///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
const allPokemonUrl = process.env.POKEMONALL_API_URL
const nameSearchBaseUrl = process.env.C_BY_NAME_BASE_URL
const Pokemon = require('../models/pokemon')

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
            //pokeNumber[pokeNumber.length -1]
            console.log('this came back from the api: \n', apiRes.data.results)
            //console.log(pokeNumber)
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

// POST -> /pokemon/captured
// gets data from the all pokemon show page and adds to the users list
router.post('/add', (req, res) => {
    const { username, loggedIn, userId } = req.session

    const thePoke = req.body
    thePoke.owner = userId
    // default value for a checked checkbox is 'on'
    // this line of code converts that two times
    // which results in a boolean value
    thePoke.favorite = !!thePoke.favorite

    Pokemon.create(thePoke)
        .then(newPoke => {
            // res.send(newPlace)
            res.redirect(`/pokemon/captured`)
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})

// GET -> /pokemon/captured
// displays all the user's saved pokemon
router.get('/captured', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // query the db for all pokemon belonging to the logged in user
    Pokemon.find({ owner: userId })
        // display them in a list format
        .then(userPokemon => {
            res.render('pokemon/captured', { pokemon: userPokemon, username, loggedIn, userId })
        })
        // or display any errors
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