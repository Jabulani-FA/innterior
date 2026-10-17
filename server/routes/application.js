const express = require('express');
const router = express.Router();
const { authCheck, adminCheck } = require('../middleware/auth');
const {
    createRoleApplication,
    myApplications,
    listApplications,
    reviewApplication,
    myMarketplaceProfile,
    updateMarketplaceProfile,
    ensureApplicationId,
    listPublicTalents,
    listPublicVendors,
} = require('../controllers/application');

router.post('/application', authCheck, createRoleApplication);
router.get('/application/mine', authCheck, myApplications);
router.get('/marketplace/talents', listPublicTalents);
router.get('/marketplace/vendors', listPublicVendors);
router.get('/admin/applications', authCheck, adminCheck, listApplications);
router.patch('/admin/application/:id', authCheck, adminCheck, ensureApplicationId, reviewApplication);
router.get('/marketplace/profile', authCheck, myMarketplaceProfile);
router.patch('/marketplace/profile', authCheck, updateMarketplaceProfile);

module.exports = router;
