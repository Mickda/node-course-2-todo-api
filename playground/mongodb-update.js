const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if(error) {
    return console.log('Unable to connect to mongo db server. Excellent.');
  }
  console.log('connected to Mongo db server');
  const db = client.db('TodoApp');

  // find one and delete
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("5a92fa19d33adeee88425bc9")
  }, {
    $set: {
      name: 'Sarah Black'
    },
  }, {
    returnOriginal: false
  }).then((result) => {
    // console.log(JSON.stringify(result, undefined, 2));
    console.log(result);
  });

  db.collection('Users').findOneAndUpdate(
    { _id: new ObjectID("5a92fa19d33adeee88425bc9") },
    {
      $set: { name: 'Lisa Smith' },
      $inc: { age: 1 }
    },
    { returnOriginal: false }
  ).then((result) => {
    // console.log(JSON.stringify(result, undefined, 2));
    console.log(result);
  });

  client.close();
});
