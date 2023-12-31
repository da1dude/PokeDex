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
            //console.log(apiRes)
            const pokemon = apiRes.data.results.map((data, index) => ({
                name: data.name,
                id: index + 1,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
            }))
            //console.log(pokemon)
            res.render('pokemon/index', { pokemon, username, userId, loggedIn})
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
    console.log(req.body)
    // default value for a checked checkbox is 'on'
    // this line of code converts that two times
    // which results in a boolean value
    thePoke.favorite = !!thePoke.favorite
    console.log(req.body)

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

// GET -> /pokemon/:id
// Will display a single instance of a user's saved pokemon
router.get('/captured/:id', (req, res) => {
    const { username, loggedIn, userId } = req.session
    console.log(req.body)
    // could use destructuring, but no need with one item
    // const { placeName } = req.params
    // make our api call
    //axios(`${nameSearchBaseUrl}${pokeName}`)
    // find a specific place using the id
    Pokemon.findById(req.params.id)
        // display a user-specific show pages
        .then(thePoke => {
            // res.send(thePoke)
            res.render('pokemon/capturedDetail', { poke: thePoke, username, loggedIn, userId })
        })
        // send an error page if something goes wrong
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})

// UPDATE -> /pokemon/update/:id
router.put('/update/:id', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // target the specific pokemon
    const pokeId = req.params.id
    const theUpdatedPoke = req.body

    // sometimes mean hackers try to steal stuff
    // remove the ownership from req.body(even if it isn't sent)
    // then reassign using the session info
    delete theUpdatedPoke.owner
    theUpdatedPoke.owner = userId

    // default value for a checked checkbox is 'on'
    // this line of code converts that two times
    // which results in a boolean value

    theUpdatedPoke.favorite = !!theUpdatedPoke.favorite

    console.log('this is req.body', theUpdatedPoke)
    // find the place
    Pokemon.findById(pokeId)
        // check for authorization(aka ownership)
        // if they are the owner, allow update and refresh the page
        .then(foundPoke => {
            // determine if loggedIn user is authorized to update this(aka, the owner)
            if (foundPoke.owner == userId) {
                // here is where we update
                return foundPoke.updateOne(theUpdatedPoke)
            } else {
                // if the loggedIn user is NOT the owner
                res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Update%20this%20Poke`)
            }
        })
        .then(returnedPoke => {
            res.redirect(`/pokemon/captured/${pokeId}`)
        })
        // if not, send error
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