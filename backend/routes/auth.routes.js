const express = require("express");
const authController = require('../controller/authController.js');


const router = express.Router();

router.post("/register", authController.registerCtrl);

router.post("/login", authController.loginCtrl);


module.exports = router;