const mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// var newTodo = new Todo({
//   text: 'Cook dinner'
// });

// newTodo.save().then((document) => {
//   console.log('Saved todo', document);
// }, (error) => {
//   console.log('Unable to save todo', error);
// })

module.exports = {Todo}
