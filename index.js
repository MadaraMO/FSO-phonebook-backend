
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


// tad kā? express.json() un/vai bodyParser?
app.use(express.json())
app.use(bodyParser.json())


app.use(cors())
app.use(express.static('build'))


morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms :body')
)

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 2
    },
    {
        "name": "Mo Young",
        "number": "123-429-3958",
        "id": 3
    },
    {
        "name": "Slavoj Zizek",
        "number": "20-5872-4728",
        "id": 4
    }
]


app.get('/api/persons', (req, res) => {
    console.log("entered /api/persons, finding all persons")
    Person.find({})
    console.log(find())
        .then(result => {
            console.log("entered Person.find({}).then callback")
            console.log(`resolved persons ${JSON.stringify(result)}`)
            
            res.json(result.map(person => person.toJSON()))
            console.log(person)
        })
        // .then(result => {
        //     res.status(204).end()
        // })
        .catch((err) => {
            res.status(404).end()
        })

})

// app.get('/api/persons', (req, res) => {
//     console.log("entered /api/persons, finding all persons")
//     Person.find({}).then(persons => {
//         console.log("entered Person.find({}).then callback")
//         console.log(`resolved persons ${JSON.stringify(persons)}`) // <-- JSON.stringify, jo Node mēdz slikti formatēt logus, ja dod objektus
//         console.log(find())
//         res.json(persons)
//         console.log(persons)
//     })
// })

app.get('/info', (req, res) => {
    const message = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date}</p>`
    res.send(message)
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            res.json(person)
        })
    // const id = Number(req.params.id)
    // const person = persons.find(person => person.id === id)
    // if (person) {
    //     res.json(person)
    // } else {
    //     res.status(404).end()
    // }
})

app.delete('/api/persons/:id', (req, res) => {
    // Nez vai tagad ir Number
    // const id = Number(req.params.id)
    // persons = persons.filter(person => person.id !== id)

    // res.status(204).end()
    // Person.findOneAndDelete(req.params.id)
    //     .then(result => {
    //         res.status(204).end()
    //     })
})

app.post('/api/persons', (req, res) => {
    const generateId = (max) =>
        Math.floor(Math.random() * Math.floor(max))

    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId(10000)
    })

    person.save().
        then(savedPerson => {
            res.json(savedPerson)
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})