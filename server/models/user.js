const mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

// var user = new User({
//   email: 'me@example.com'
// });
//
// user.save().then((document) => {
//   console.log('Saved user', document);
// }, (error) => {
//   console.log('Unable to save user', error);
// })

module.exports = {User}
