///////////////////////////////////
// Our Schema and dependencies ////
///////////////////////////////////
const mongoose = require('../utils/connection')

// destructuring the Schema and model from mongoose
const { Schema, model } = mongoose

/////////////////////////
// Schema definition ////
/////////////////////////
const pokemonSchema = new Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    customName: { type: String},
    favorite: { type: Boolean },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
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