const express = require('express');
const router = express.Router();
const userRecord = require('./controller');

// Create new training record
router.post('/create', userRecord.create);

router.get('/list', userRecord.find);

router.put('/update/:productId', userRecord.update);

module.exports = router;
