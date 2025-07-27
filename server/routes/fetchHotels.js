const express = require('express');
const router = express.Router();

const {fetchControl} = require('../controllers/fetchControl')

router.post('/home',fetchControl);

module.exports = router;