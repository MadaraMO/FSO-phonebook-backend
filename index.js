
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


// tad kā? express.json() un/vai bodyParser? atkāpties un noskaidrot
app.use(express.json())
app.use(bodyParser.json())


app.use(cors())
app.use(express.static('build'))


// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :body')
)

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
}

app.use(requestLogger)


// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//     },
//     {
//         "name": "Dan Abramov",
//         "number": "12-43-234345",
//         "id": 2
//     },
//     {
//         "name": "Mo Young",
//         "number": "123-429-3958",
//         "id": 3
//     },
//     {
//         "name": "Slavoj Zizek",
//         "number": "20-5872-4728",
//         "id": 4
//     }
// ]

// darbojas
app.get('/api/persons', (req, res) => {
    console.log('entered /api/persons, finding all persons')
    Person.find({})
        .then(result => {
            console.log('entered Person.find({}).then callback')
            console.log(`resolved persons ${JSON.stringify(result)}`)
            console.log(Person.find())
            res.json(result.map(person => person.toJSON()))
            // console.log(person)
        })
        // .then(result => {
        //     res.status(204).end()
        // })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
            res.status(204).end()
        })
})

// darbojas
app.get('/info', (req, res) => {
    Person.find({}).then(result => {
        res.send(`<p>Phonebook has info for ${result.length} people</p>
    <p>${new Date}</p>`)
    })
})

// darbojas
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

// darbojas
app.delete('/api/persons/:id', (req, res, next) => {
    // de:57604) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()` without the
    // the`useFindAndModify` option set to false are deprecated.`
    // mongo.js  ieliku useFindAndModify: false, brīdinājums turpinās
    Person.findByIdAndRemove(req.params.id)
        // eslint-disable-next-line no-unused-vars
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// darbojas
app.post('/api/persons', (req, res, next) => {
    // const generateId = (max) =>
    //     Math.floor(Math.random() * Math.floor(max))

    const body = req.body

    // if (!body.name) {
    //     return res.status(400).json({
    //         error: 'name missing'
    //     })
    // }

    // if (!body.number) {
    //     return res.status(400).json({
    //         error: 'number missing'
    //     })
    // }
    // if (persons.find(person => person.name === body.name)) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        // id: generateId(10000)
    })

    person.save().
        then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true }, { runValidators: true, context: 'query' })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

// const unknownEndpoint = (req, res) => {
//     res.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    // eslint-disable-next-line eqeqeq
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})