const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
  static signupGet(req, res) {
    res.render('signup');
  }

  static loginGet(req, res) {
    res.render('login');
  }

  static async signupPost(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    } catch (err) {
      const errors = AuthController.handleErrors(err);
      res.status(400).json({ errors });
    }
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } catch (err) {
      res.status(400).json({ errors: err.message });
    }
  }

  static logout(req, res) {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }

  static handleErrors(err) {
    let errors = { email: '', password: ''};

    if (err.code === 11000) {
      errors.email = 'Email already taken';
      return errors
    }

    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({properties}) => {
        errors[properties.path] = properties.message;
      })
    }

    return errors;
  }
}

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
  return jwt.sign({ id }, 'Add secret key here', {
    expiresIn: maxAge
  })
}

module.exports = AuthController;
