const express = require('express');
const { AdminLogin } = require('../controllers/adminController');

const AdminRouter = express.Router();


AdminRouter.post('/login', AdminLogin);


module.exports = AdminRouter;
