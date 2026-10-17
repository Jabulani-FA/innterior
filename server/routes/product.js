const express = require('express')
const router = express.Router()

// middleware
const { authCheck,adminCheck,vendorCheck } = require('../middleware/auth')

//controller
const { create, listAll, listVendorProducts, listPublicVendorProducts, read, remove, update, list, productsCount, productStar, listRelated, searchFilters } = require('../controllers/product')

// routes
router.post('/product', authCheck, async (req, res, next) => {
	if (req.user?.email) {
		const User = require('../models/user');
		const account = await User.findOne({ email: req.user.email }).select('role').exec();
		if (account?.role === 'admin') return adminCheck(req, res, next);
	}
	return vendorCheck(req, res, next);
}, create)
router.get('/vendor/products', authCheck, vendorCheck, listVendorProducts)
router.get('/marketplace/vendors/:vendorId/products', listPublicVendorProducts)
router.get('/products/total', productsCount)
router.get('/product/:slug', read)
router.put('/product/:slug', authCheck, async (req, res, next) => {
	const User = require('../models/user');
	const account = await User.findOne({ email: req.user.email }).select('role').exec();
	if (account?.role === 'admin') return adminCheck(req, res, next);
	req.vendorWrite = true;
	return vendorCheck(req, res, next);
}, update)
router.delete('/product/:slug', authCheck, async (req, res, next) => {
	const User = require('../models/user');
	const account = await User.findOne({ email: req.user.email }).select('role').exec();
	if (account?.role === 'admin') return adminCheck(req, res, next);
	req.vendorWrite = true;
	return vendorCheck(req, res, next);
}, remove)
router.get('/products/:count', listAll)

router.post('/products', list)
router.post('/search/filters', searchFilters)

// rating
router.put('/product/star/:productId', authCheck, productStar)
router.get('/product/related/:productId', listRelated)
module.exports = router;