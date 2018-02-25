const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if(error) {
    return console.log('Unable to connect to mongo db server. Excellent.');
  }
  console.log('connected to Mongo db server');
  const db = client.db('TodoApp');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5a92f3c979a839edfbb138fb')
  // }).toArray().then((documents) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(documents, undefined, 2));
  // }, (error) => {
  //   console.log('Unable to fetch todos');
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos: count: ${count}`);
  //   console.log(JSON.stringify(count, undefined, 2));
  // }, (error) => {
  //   console.log('Unable to fetch todos');
  // });

  db.collection('Users').find({
    name: 'Sarah Black'
  }).toArray().then((documents) => {
    console.log(JSON.stringify(documents, undefined, 2));
  }, (documents) => {
    console.log('Unable to fetch todos');
  });

  // client.close();
});
