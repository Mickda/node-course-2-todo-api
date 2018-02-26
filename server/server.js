require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
  var todo = new Todo({
    text: request.body.text,
    completed: request.body.completed
  });

  todo.save().then((user) => {
    response.send(user)
  }).catch(error => {

  })
})

app.get('/todos', (request, response) => {
  Todo.find().then((todos) => {
    response.send({todos})
  }, (error) => {
    response.status(400).send(error);
  });
});

app.get('/todos/:id', (request, response) => {
  var id = request.params.id;
  if (!ObjectId.isValid(id)) {
    response.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      response.status(404).send();
    }
    response.status(200).send({todo});
  }).catch((error) => {
    response.status(400).send();
  });
});

app.delete('/todos/:id', (request, response) => {
  var id = request.params.id;
  if (!ObjectId.isValid(id)) {
    response.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      response.status(404).send();
    }
    response.status(200).send({todo});
  }).catch((error) => {
    response.status(404).send();
  });
});

app.patch('/todos/:id', (request, response) => {
  var id = request.params.id;
  var body = _.pick(request.body, ['text', 'completed']);

  console.log(`request body is`);
  console.log(request.body);
  console.log(`body is`);
  console.log(body);

  if (!ObjectId.isValid(id)) {
    response.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    console.log('wtf am I doing here?')
    body.completed = false;
    body.completedAt = null;
  }

  console.log(`now body is`);
  console.log(body);

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    response.send({todo});
  }).catch((error) => {
    response.status(400).send();
  })
});

app.post('/users', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
  }).then((token) => {
    console.log(`adding header ${token}`);
    response.header('x-auth', token).send(user);
  }).catch((error) => {
    response.status(400).send(error);
  })
});

app.post('/users/login', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);

  console.log(`email is ${body.email}`);
  User.findByCredentials(body.email, body.password).then((user) => {

    return user.generateAuthToken().then((token) => {
      response.header('x-auth', token).send(user);
    })
  }).catch((error) => {
    response.status(400).send();
  })
});

app.get('/users/me', authenticate, (request, response) => {
  response.send(request.user);
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});

module.exports = { app };
