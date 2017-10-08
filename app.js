var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

function loadDatabase() {
  return new Promise(function (resolve) {
    console.log("Loading people data...");

    var csv = require('ya-csv');
    var reader = csv.createCsvFileReader('people.csv', {
      columnsFromHeader: true
    });
    var people = [];
    var id = 0;

    reader.addListener('end', function () {
      console.log("Done loading people data.");
      resolve(people);
    });

    reader.addListener('data', function (data) {
      id += 1;
      var person = {
        id: id,
        first: data.fname,
        middle: data.mname,
        last: data.lname,
        gender: data.gender,
        ssn: data.ssn,
        salary: data.salary,
        birthDate: data.dob
      };
      people.push(person);
    });
  });
}

function initialize() {
  return new Promise(function (resolve, reject) {
    loadDatabase()
      .then(function (people) {
          resolve({
            people: people
          })
        },
        function (msg) {
          reject(new Error(msg));
        });
  });
}

function runApplication(initData) {
  var people = initData.people;

  console.log("Starting application with " + people.length + " people.");
  // logger.info("Version: " + config.version);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(express.static(path.join(__dirname, 'public/')));

  // Initialize app. logging.
  // See http://stackoverflow.com/questions/23494956/how-to-use-morgan-logger
  var httpLog = morgan('dev', {
    'format': 'dev',
    'stream': {
      write: function (str) { console.log(str.trim()); }
    }
  });
  app.use(httpLog);

  // Handlers

  app.get('/people/:prefix', function (req, res) {
    var prefix = req.params.prefix.toLowerCase();
    var matches = null;
    if (prefix === '*') {
      matches = people;
    }
    else {
      matches = [];
      for (var i = 0; i < people.length; i++) {
        var person = people[i];
        if (person.last.toLowerCase().indexOf(prefix) === 0) {
          matches.push(person);
        }
      }
    }
    res.status(200).send({people: matches});
  });

  app.get('/person/:id', function (req, res) {
    var person = null;
    var id = parseInt(req.params.id);
    for (var i = 0; i < people.length; i++) {
      if (people[i].id === id) {
        person = people[i];
        break;
      }
    }
    if (person === null) {
      res.status(404).send({error: "Person with ID " + id + " not found."});
    }
    else {
      res.status(200).send({person: person});
    }

  });

  app.post('/person/:id', function (req, res) {
    var person = req.body;
    var id = parseInt(req.params.id);
    var found = false;
    for (var i = 0; i < people.length; i++) {
      if (people[i].id === id) {
        people[i].first = person.first;
        people[i].last = person.last;
        people[i].middle = person.middle;
        people[i].gender = person.gender;
        people[i].ssn = person.ssn;
        people[i].salary = person.salary;
        people[i].birthDate = person.birthDate;
        person = people[i];
        found = true;
        break;
      }
    }

    if (found) {
      res.status(200).send({person: person})
    }
    else {
      res.status(404).send({error: "Person with ID " + id + " not found."});
    }
  });
}

function abort(err) {
  console.log(err.message);
  process.exit(1);
}

initialize().then(runApplication, abort);

module.exports = app;
