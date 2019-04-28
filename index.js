const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

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

app.use(bodyParser.json());

morgan.token('body', function (req, res) { return JSON.stringify(req.body); });

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['body'](req,res)
    ].join(' ')
}));

// app.use(morgan('tiny'));

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