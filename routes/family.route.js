const express = require('express');
const { createFamily, fetchFamilies, getParticularFamily } = require('../controllers/family.controller');

const router = express.Router();

router.post('/create', createFamily);
router.get('/get/:email', fetchFamilies);
router.get('/get-family/:familyId', getParticularFamily);

module.exports = router;
