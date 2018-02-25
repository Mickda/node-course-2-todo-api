const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = "6a932ae9ec2756f3ca864a0211";

// if (!ObjectId.isValid(id)) {
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// });

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((error) => console.log(error));

var id = "5a9315a2f707b5f10a508934";

User.findById(id).then((user) => {
  if (!user) {
    return console.log('id not found');
  }
  console.log('Todo by id', user);
}, (error) => {
  console.log(error);
});
