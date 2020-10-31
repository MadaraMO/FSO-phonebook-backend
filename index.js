const express = require('express')
const app = express()

app.use(express.json())

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

// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(p => p.id))
//         : 0
//     return maxId + 1
// }

// app.post('/api/persons', (req, res) => {
//     const body = req.body

//     if (!body.content) {
//         return res.status(400).json({
//             error: 'content missing'
//         })
//     }
app.post('/api/persons', (req, res) => {
    const person = req.body
    console.log(person)

    response.json(person)
})

// const person = {
//     content: body.content,
//     date: new Date(),
//     id: generateId(),
// }

// persons = persons.concat(person)

// res.json(person)
// })

const PORT = 0
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})