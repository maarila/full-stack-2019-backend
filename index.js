const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

morgan.token('body', function(req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(bodyParser.json());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '045-1236543'
  },
  {
    id: 2,
    name: 'Arto Järvinen',
    number: '041-21423123'
  },
  {
    id: 3,
    name: 'Lea Kutvonen',
    number: '040-4323234'
  },
  {
    id: 4,
    name: 'Martti Tienari',
    number: '09-784232'
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number missing'
    });
  }

  const nameExists = persons.find(person => person.name === body.name);

  if (nameExists) {
    return res.status(400).json({
      error: 'Name must be unique'
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000000),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.get('/info', (req, res) => {
  res.send(
    `<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p>${new Date()}`
  );
});

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(person => person.id === Number(req.params.id));
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(person => person.id !== Number(req.params.id));
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
