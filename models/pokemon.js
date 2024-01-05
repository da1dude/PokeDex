///////////////////////////////////
// Our Schema and dependencies ////
///////////////////////////////////
const mongoose = require('../utils/connection')

// destructuring the Schema and model from mongoose
const { Schema, model } = mongoose


/////////////////////////
// Schema definition ////
/////////////////////////

const notesSchema = new Schema({
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: { type: String }
}, {
    timestamps: true
})


/////////////////////////
// Schema definition ////
/////////////////////////
const pokemonSchema = new Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    type: { type: String},
    customName: { type: String},
    species: { type: String},
    favorite: { type: Boolean },
    hp: { type: String},
    attack: { type: String},
    defense: { type: String},
    speed: { type: String},
    height: { type: String},
    weight: { type: String},
    img: { type: String},
    description: { type: String},
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: [notesSchema]
}, {
    timestamps: true
})

/////////////////////////
// create user model ////
/////////////////////////
const Pokemon = model('Pokemon', pokemonSchema)

/////////////////////////
// export user model ////
/////////////////////////
module.exports = Pokemon