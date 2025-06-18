const express = require('express');
const { createFamily, fetchFamilies, getParticularFamily, deleteFamilyMember, updateMemberRole, updateFamilyDetails, deleteParticularFamily } = require('../controllers/family.controller');

const router = express.Router();

router.post('/create', createFamily);
router.get('/get/:email', fetchFamilies);
router.get('/get-family/:familyId', getParticularFamily);
router.delete('/delete-member/:familyId/:memberId', deleteFamilyMember);
router.put('/update-member/:familyId/:memberId', updateMemberRole);
router.put('/update-family/:familyId', updateFamilyDetails);
router.delete('/delete-family/:familyId', deleteParticularFamily);

module.exports = router;
