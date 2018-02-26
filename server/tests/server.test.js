const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectId} = require('mongodb')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'test todo text perfect';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text);
      })
      .end((error, response) => {
        if (error) {
          return done(error);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((error) => done(error))
      });
  });

  it('should be testing this one too', (done) => {
    var text = 'test todo text perfect';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .end((error, response) => {
        if (error) {
          console.log(error);
          done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((error) => done(error));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(2);
      })
      .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${new ObjectId().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/dfsdf`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo._id).toBe(hexId);
      })
      .end((error, result) => {
        if (error) {
          return done(error);
        }

        Todo.findById(`${hexId}`).then((todo) => {
          expect(todo).toBe(null);
          return done(error);
        }).catch((error) => done(error));
      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectId().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is not valid', (done) => {
    request(app)
      .delete(`/todos/someInvalidID`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var todo = todos[0];
    todo.text = "Change text";

    request(app)
      .patch(`/todos/${hexId}`)
      .send(todo)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todo.text);
        expect(response.body.todo.completed).toBe(true);
      })
      .end(done);
  });

  it('should clear completed at when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var todo = todos[1];
    todo.text = "Change text";

    request(app)
      .patch(`/todos/${hexId}`)
      .send(todo)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todo.text);
        expect(response.body.todo.completed).toBe(false);
        expect(response.body.todo.completedAt).toBe(null);
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body._id).toBe(users[0]._id.toHexString());
        expect(response.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({});
      })
      .end(done);
  });
})

describe('GET /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'dfsdf2423';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toExist();
        expect(response.body._id).toExist();
        expect(response.body.email).toBe(email);
      })
      .end((error) => {
        if (error) {
          return done(error);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          //expect(user.password).ToNotBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'exampleexample.com';
    var password = 'dfsdf2423';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create usaer if email already in use', (done) => {
    var email = 'jen@example.com';
    var password = 'dfsdf2423';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toExist();
        done();
      })
      .end((error, response) => {
        if(error) {
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: response.headers['x-auth']
          });
        }).catch((error) => done(error));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .end((error, response) => {
        if(error) {
          return done(error);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toEqual(0);
          done();
        }).catch((error) => done(error));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((error, response) => {
        if(error) {
          return done(error);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toEqual(0);
          done();
        }).catch((error) => done(error));
      });
  });
});
