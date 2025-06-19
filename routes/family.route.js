const express = require('express');
const { createFamily, fetchFamilies, getParticularFamily, deleteFamilyMember, updateMemberRole, updateFamilyDetails, deleteParticularFamily, getFiveRandomFamilySugs } = require('../controllers/family.controller');

const router = express.Router();

router.post('/create', createFamily);
router.get('/get/:email', fetchFamilies);
router.get('/get-family/:familyId', getParticularFamily);
router.delete('/delete-member/:familyId/:memberId', deleteFamilyMember);
router.put('/update-member/:familyId/:memberId', updateMemberRole);
router.put('/update-family/:familyId', updateFamilyDetails);
router.delete('/delete-family/:familyId', deleteParticularFamily);
router.get('/five-random-suggestions/:userId', getFiveRandomFamilySugs);
router.post('/join-random-family', getFiveRandomFamilySugs);

module.exports = router;
