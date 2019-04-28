const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = 3001;

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
];

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:  ', req.path);
    console.log('Body:  ', req.body);
    console.log('---');
    next()
};

app.use(bodyParser.json());
app.use(requestLogger);

app.get('/info', (req, res) => {
    const now = new Date();

    res.setHeader("Content-Type", "text/html");
    res.send(`<html>
                <body>
                    <p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                    <p>${now}</p>
                </body>
              </html>`);
});

const newId = () => Math.floor(Math.random() * Math.floor(100000));

app.post('/api/persons', (req, res) => {
    console.log(`POST /api/persons called`);

    const content = req.body;

    if (!content || !content.name || !content.number) {
        return res.status(400).json({
            error: 'Content missing'
        });
    }

    if(persons.some(p => p.name === content.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = {
        name: content.name,
        number: content.number,
        id: newId()
    };

    persons = persons.concat(person);

    res.json(person);

});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    const person = persons.find(p => p.id === id);

    if(person) {
        res.json(person);
    } else {
        res.status(404).json(
            {
                error: `Henkilöä id: ${id} ei löydy`
            }
        );
    }

    resp.send(persons);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    persons = persons.filter(p => p.id !== id);

    res.status(204).end();
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});