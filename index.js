const express = require('express');
const app = express();

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

app.get('/api/persons', (req, res) => {
    console.log(`/api/persons called`);
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(`/api/persons/${id} called`);

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});