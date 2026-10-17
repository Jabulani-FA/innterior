const express = require('express')
const router = express.Router()

// middleware
const { authCheck,adminCheck,vendorCheck } = require('../middleware/auth')

//controller
const { upload, remove } = require('../controllers/cloudinary')

router.post('/upload-image', authCheck, async (req, res, next) => {
	const User = require('../models/user');
	const account = await User.findOne({ email: req.user.email }).select('role').exec();
	if (account?.role === 'admin') return adminCheck(req, res, next);
	return vendorCheck(req, res, next);
}, upload)
router.post('/remove-image', authCheck, async (req, res, next) => {
	const User = require('../models/user');
	const account = await User.findOne({ email: req.user.email }).select('role').exec();
	if (account?.role === 'admin') return adminCheck(req, res, next);
	return vendorCheck(req, res, next);
}, remove)

module.exports = router