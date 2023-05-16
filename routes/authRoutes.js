const { Router } = require('express');
const authController = require('../controllers/authController');
const { dontRequireAuth } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/signup', dontRequireAuth, authController.signupGet);
router.post('/signup', dontRequireAuth, authController.signupPost);
router.get('/login', dontRequireAuth, authController.loginGet);
router.post('/login', dontRequireAuth, authController.loginPost);
router.get('/logout', authController.logout);

module.exports = router;
