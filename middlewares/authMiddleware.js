const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.SECRET_KEY

const requireAuth = (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
}

const dontRequireAuth = (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        next();
      } else {
        res.redirect('/');
      }
    });
  } else {
    next();
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, secretKey, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser, dontRequireAuth };
