const bcrypt = require('bcrypt');
const Boom = require('@hapi/boom');

const UserStore = {
  users: {},
  initialize: () => {
    UserStore.createUser('John', 'john.doe@example.com', 'password');
  },
  createUser: (name, email, password, callback) => {
    bcrypt.genSalt((err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        const user = {
          name,
          email,
          passwordHash: hash
        };
        if (UserStore.users[email]) {
          callback(Boom.conflict('Email already exists. Please Login.'));
        } else {
          UserStore.users[email] = user;

          if (callback) callback();
        }
      });
    });
  },
  validateUser: (email, password, callback) => {
    const user = UserStore.users[email];
    if (!user) {
      callback(Boom.notFound('User does not exist.'));
      return;
    }

    bcrypt.compare(password, user.passwordHash, (err, isValid) => {
      if (!isValid) {
        callback(Boom.unauthorized('Password does not match.'));
      } else {
        callback(null, user);
      }
    });
  }
};

module.exports = UserStore;
