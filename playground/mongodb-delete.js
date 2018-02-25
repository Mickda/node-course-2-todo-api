const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if(error) {
    return console.log('Unable to connect to mongo db server. Excellent.');
  }
  console.log('connected to Mongo db server');
  const db = client.db('TodoApp');

  // delete Many
  db.collection('Users').deleteMany({
    name: 'Jim Black'
  }).then((result) => {
    console.log(result);
  });

  // delete One
  // db.collection('Users').deleteOne({
  //   _id: new ObjectID("5a92f9ac79a214ee775a2bba")
  // }).then((result) => {
  //   console.log(result);
  // });

  // find one and delete
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID("5a93075c4436f382e083bc09")
  }).then((results) => {
    console.log(JSON.stringify(results, undefined, 2));
  });

  client.close();
});
