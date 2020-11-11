const mongoose = require('mongoose')

const password = process.argv[2]

const url =
    `mongodb+srv://mad_mad_mad:${password}@cluster0.pln8b.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    date: new Date()
})

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}


if (process.argv.length === 5) {
    person.save().then(result => {
        console.log(`${person.name} with number: ${person.number} is saved to phonebook!`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
