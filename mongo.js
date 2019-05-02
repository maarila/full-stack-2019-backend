const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('please give a password and/or a new person as arguments');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fs-2019-user:${password}@fs-2019-cluster-nvfxb.mongodb.net/people?retryWrites=true`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

mongoose.connect(url, { useNewUrlParser: true });

if (process.argv.length === 3) {
  console.log('puhelinluettelo:');
  Person.find({}).then(response => {
    response.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length >= 5) {
  console.log(
    `lisätään ${process.argv[3]} numero ${process.argv[4]} luetteloon`
  );
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });
  person.save().then(response => {
    mongoose.connection.close();
  });
} else {
  console.log('Danger, danger! Weird number of arguments!');
  mongoose.connection.close();
}
