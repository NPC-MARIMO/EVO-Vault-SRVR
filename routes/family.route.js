const express = require('express');
const { createFamily, fetchFamilies, getParticularFamily, deleteFamilyMember, updateMemberRole } = require('../controllers/family.controller');

const router = express.Router();

router.post('/create', createFamily);
router.get('/get/:email', fetchFamilies);
router.get('/get-family/:familyId', getParticularFamily);
router.delete('/delete-member/:familyId/:memberId', deleteFamilyMember);
router.put('/update-member/:familyId/:memberId', updateMemberRole);

module.exports = router;
