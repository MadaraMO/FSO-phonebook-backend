const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny', ':method :url :status :res[content-length] - :response-time ms'))

// const unknownEndpoint = (req, res) => {
//     res.status(404).send({ error: 'unknown endpoint' })
// }


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
    res.json(persons)
})

app.get('/info', (req, res) => {
    const message = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p>`
    res.send(message)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(10000)
    }

    persons = persons.concat(person);
    res.json(person);
})

// app.use(unknownEndpoint)

const PORT = 3001
// Foroumā tika ierosināts listen neizmantot PORT, 
// eksportēt tikai app, jo es nevarēju izmantot vienlaikus
// yarn start un yarn dev -- ports vienmēr bija aizņemts,
// lai ko es tur killotu, lai uz kādu portu mainītu.
// izdevās palaist tad, kad es no šejiees v izdzēsu PORT,
// un pēc tam atkal iekopēju atpakaļ. wut. #EADDRINUSE
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})