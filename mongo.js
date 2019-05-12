const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    number: String,
    name: String
});

const Person = mongoose.model('Person', personSchema);

const addPerson = function(name, number) {

    const person = new Person({
        name: name,
        number: number
    });

    person.save().then( res => {
        console.log(`lisätään ${person.name} numero ${person.number} luetteloon`);
        mongoose.connection.close();
    });
};

const printPersons = function() {

    console.log("Puhelinluettelo");

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });

};

const args = process.argv.slice(2);
console.log(args);
if (!args.length) {
    console.log(`password is missing`);
    process.exit(2);
}

const pwd = args[0];
const connectionString =
    `mongodb+srv://ilkka-mooc:${pwd}@ilkka-mooc-cluster-0-5ynuk.mongodb.net/puhelinluettelo?retryWrites=true`;


mongoose.connect(connectionString, {useNewUrlParser: true});


if (args.length >= 3) {
    addPerson(args[1], args[2]);
} else {
    printPersons();
}


