const express = require('express');
const router = express.Router();


const {fetchControl} = require('../controllers/fetchControl')
const {mailControl} = require('../controllers/MailControl');
router.post('/home',fetchControl);
router.post('/mail', mailControl);

module.exports = router;