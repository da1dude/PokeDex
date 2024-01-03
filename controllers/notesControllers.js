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
router.post('/pokemon/captured/:id/notes', (req, res) => {
    const { username, loggedIn, userId } = req.session
    const theNote = req.body
    theNote.user = userId
    Pokemon.findById(req.params.id)
        .then(poke => {
            poke.notes.push(req.body)
            return poke.save()
        })
        .then(savedPoke => {
            res.redirect(`/pokemon/captured/${req.params.id}`)
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})


router.delete('/notes/:id', async (req, res) => {
    const { username, loggedIn, userId } = req.session
    const poke = await Pokemon.findOne({ 'notes._id': req.params.id, 'notes.user': userId });
    // Rogue user!
    if (!poke) return res.redirect(`/pokemon/captured/${poke._id}`)
    // Remove the note using the remove method available on Mongoose arrays
    poke.notes.remove(req.params.id);
    // Save the updated poke doc
    await poke.save();
    // Redirect back to the poke's show view
    res.redirect(`/pokemon/captured/${poke._id}`)
})



// router.post('/pokemon/captured/:id/notes', async (req, res) => {
//     const { username, loggedIn, userId } = req.session
//     const poke = await Pokemon.findById(req.params.id);
//     console.log('this is req.params:', req.params)

//     const theNote = req.body
//     theNote.user = userId
//     console.log('this is req.body', req.body)
//     console.log('this is theNote', theNote)

//     poke.notes.push(theNote)
//         try {
//             await poke.save()
//             res.redirect(`/pokemon/captured/${req.params.id}`)
//         } catch (err) {
//             console.log(err)
//         }
// })



/////////////////////
// Export Router ////
/////////////////////
module.exports = router