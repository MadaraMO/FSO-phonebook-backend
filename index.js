
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')



app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
    next()
}

app.use(requestLogger)


app.get('/api/persons', (req, res) => {
    console.log('entered /api/persons, finding all persons')
    Person.find({})
        .then(result => {
            console.log('entered Person.find({}).then callback')
            console.log(`resolved persons ${JSON.stringify(result)}`)
            console.log(Person.find())
            res.json(result.map(person => person.toJSON()))
        })
        .catch((error) => {
            res.status(204).end()
        })
})


app.get('/info', (req, res) => {
    Person.find({}).then(result => {
        res.send(`<p>Phonebook has info for ${result.length} people</p>
    <p>${new Date}</p>`)
    })
})


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


app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons', (req, res, next) => {

    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
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
    const opts = { runValidators: true }
    // { new: true } opts vietā
    Person.findByIdAndUpdate(req.params.id, { person }, opts)
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
    console.error(error.message)

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