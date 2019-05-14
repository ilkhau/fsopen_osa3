const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);

const mongoUrl =  process.env.MONGO_CONNECTION_STRING;

console.log(`Connectionstring: ${mongoUrl}`);

mongoose.connect(mongoUrl, {useNewUrlParser: true})
    .then(res => {
        console.log('Connected to database.')
    })
    .catch(err => {
        console.log(`Cannot connect to database: ${err.message}`);
    });

const personSchema = new mongoose.Schema({
    number: {type: String, required: true, minlength: 8},
    name: {type: String, required: true, minlength: 3, unique: true}
});

personSchema.plugin(uniqueValidator);
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
