const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const mongoErrorHandler = require('./services/mw/errorhandler');

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body);
});

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['body'](req, res)
    ].join(' ')
}));

app.get('/info', (req, res) => {
    const now = new Date();

    const count = Person.find({}).then(persons => {

        res.setHeader("Content-Type", "text/html");
        res.send(`<html>
                <body>
                    <p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
                    <p>${now}</p>
                </body>
              </html>`);
    });

});

app.post('/api/persons', (req, res, next) => {

    const content = req.body;

    if (!content || !content.name || !content.number) {
        return res.status(400).json({
            error: 'Content missing'
        });
    }

    const person = new Person({
        name: content.name,
        number: content.number,
    });

    person.save()
        .then(p => {
            res.json(p.toJSON());
        })
        .catch(err => {
            next(error);
        });
});

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons);
        })
        .catch(err => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(p => {
            if (p) {
                res.send(p.toJSON());
            } else {
                res.status(404).end();
            }
        }).catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res) => {

    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        });
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
};

app.use(unknownEndpoint);
app.use(mongoErrorHandler());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
