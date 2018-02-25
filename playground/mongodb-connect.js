const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if(error) {
    return console.log('Unable to connect to mongo db server. Excellent.');
  }
  console.log('connected to Mongo db server');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert todo. Excellent.', error)
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });
  //
  // db.collection('Users').insertOne({
  //   name: 'Jim Black',
  //   age: 54
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user. Excellent.', error)
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  client.close();
});
