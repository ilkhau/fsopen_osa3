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

app.get('/api/persons', (req, resp) => {
    console.log(`/api/persons called`);
    resp.send(persons);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});