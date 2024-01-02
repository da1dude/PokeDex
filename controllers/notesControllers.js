///////////////////////////
// Import Dependencies ////
///////////////////////////
const express = require('express')
const axios = require('axios')
// const allPokemonUrl = process.env.POKEMONALL_API_URL
// const nameSearchBaseUrl = process.env.C_BY_NAME_BASE_URL
const Pokemon = require('../models/pokemon')

/////////////////////
// Create Router ////
/////////////////////
const router = express.Router()

////////////////////////////
// Routes + Controllers ////
////////////////////////////


// POST -> /pokemon/captured/notes/:id
// router.post('/pokemon/captured/:id/notes', async (req, res) => {
//     const { username, loggedIn, userId } = req.session
//     const poke = await Pokemon.findById(req.params.id);
//     console.log('this is req.params:', req.params)

//     const theNote = req.body
//     theNote.owner = userId
//     console.log('this is req.body', req.body)

//     poke.notes.push(theNote)
//         .then(newNote => {
//             poke.save()
//             res.redirect(`/pokemon/captured/`)
//         })
//         .catch(err => {
//             console.log('error')
//             res.redirect(`/error?error=${err}`)
//         })
// })


router.post('/pokemon/captured/:id/notes', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const poke = Pokemon.findById(req.params.id);
    console.log('this is req.params:', req.params)

    const theNote = req.body
    theNote.owner = userId
    console.log('this is req.body', req.body)
    // default value for a checked checkbox is 'on'
    // this line of code converts that two times
    // which results in a boolean value
    console.log(theNote)

    Pokemon.notes.create(theNote)
        .then(newNote => {
            // res.send(newPlace)
            res.redirect(`/pokemon/captured`)
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})


/////////////////////
// Export Router ////
/////////////////////
module.exports = router