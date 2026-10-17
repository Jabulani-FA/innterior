const Product = require('../models/product');
const User = require("../models/user")
const mongoose = require('mongoose');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const productData = { ...req.body, slug: slugify(req.body.title) };
        if (req.vendor && req.vendorWrite !== false) productData.vendorId = req.vendor._id;
        const newProduct = await new Product(productData).save()
        res.json(newProduct)
    }catch(err){
        console.log(err);
        res.status(400).send("Create Product Failed")
        // res.status(400).json({err: err.message,})
    }
}

exports.listAll = async(req,res) => {
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([["createdAt", "desc"]])
    .exec()
    res.json(products)
    // console.log(products);
}

exports.remove = async(req,res) => {
    try{
        const query = { slug: req.params.slug };
        if (req.vendorWrite) query.vendorId = req.vendor._id;
        const deleted = await Product.findOneAndRemove(query).exec()
        if (!deleted) return res.status(404).json({ message: 'Product not found or not owned by this vendor.' });
        res.json(deleted)
    }catch(err) {
        console.log(err);
        return res.status(400).send("Product delete Failed")
    }
}

exports.update = async(req,res) => {
    try{
        const query = { slug: req.params.slug };
        if (req.vendorWrite) query.vendorId = req.vendor._id;
        const updateData = { ...req.body };
        if (req.vendorWrite) {
            delete updateData.vendorId;
            delete updateData._id;
        }
        const updated = await Product.findOneAndUpdate(
            query,
            updateData,
            {new: true}
        ).exec()
        if (!updated) return res.status(404).json({ message: 'Product not found or not owned by this vendor.' });
        res.json(updated)
    }catch(err) {
        console.log(err);
        return res.status(400).send("Product update Failed")
    }
}

exports.read = async (req,res) => {
    const product = await Product.findOne({slug: req.params.slug}).populate("category").populate("subs").exec()
    res.json(product)
}
exports.productStar = async (req,res) => {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({email: req.user.email}).exec()
    const { star } = req.body
    
    // check if current user already rated product
    let existingRatingObject = product.ratings.find((ele) => (ele.postedBy.toString() === user._id.toString()));

    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(product._id, {
            $push: {ratings: {star: star, posted_By: user._id}},
        },
        {new: true}
        ).exec()
        console.log("rating Added", ratingAdded);
        res.json(ratingAdded)
    }
    else {
        let ratingUpdated = await Product.updateOne({
            ratings: {$elemMatch: existingRatingObject}
        },{$set: {"ratings.$.star": star}}
        ).exec()
        res.json(ratingUpdated)
    }
    
}
exports.list = async(req,res) => {
    try{
        const {sort, order, page} = req.body
        const currentPage = page  || 1
        const perPage = 5
        const products = await Product.find({})
            .skip((currentPage - 1)* perPage)
            .populate('category')
            .populate('subs')
            .sort([[ sort, order]])
            .limit(perPage)
            .exec()
        
        res.json(products)
    }
    catch(err){
        console.log(err);
    }
}

exports.productsCount = async (req,res) => {
    let total = await Product.find({})
        .estimatedDocumentCount()
        .exec()
    res.json(total)
}

exports.listRelated = async(req,res) => {
    const product = await Product.findById(req.params.productId).exec()
    const related = await Product.find({
        _id: {$ne: product._id},
        category: product.category,
    })
        .limit(3)
        .populate('category')
        .populate('subs')
        // .populate('postedBy')
        .exec()
    res.json(related)
}

const handleQuery = async(req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        // .populate('postedBy', '_id name')
        .exec()
    res.json(products)
}
const handleCategory = async(req, res, category) => {
    try{
        const products = await Product.find({ category })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            // .populate('postedBy', '_id name')
            .exec()
        res.json(products)
    }catch (err) {
        console.log(err);
    }
}
const handlePrice = async(req, res, price) => {
    try{
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate("category"," _id name")
            .populate("subs"," _id name")
            // .populate("postedBy"," _id name")
            .exec()
        res.json(products)
    } catch (err) {
        console.log(err);
    }
}

const handleStar =  ( req, res, star) => {
    Product.aggregate([
        {
            $project: {
                document: "$$ROOT",
                floorAverage: {
                    $floor: {$avg: "ratings.star"}
                }
            }
        },
        { $match: {floorAverage: star}}
    ])
    .limit(12)
    .exec((err, aggregates) => {
        if(err) console.log("AGGREGATE ERROR", err)
        Product.find({_id: aggregates})
            .populate("category"," _id name")
            .populate("subs"," _id name")
            // .populate("postedBy"," _id name")
            .exec((err, products) => {
                if(err) console.log("PRODUCT AGGREGATE ERROR", err)
                res.json(products)
            })
    })
}
const handleSub = async(req, res, sub) => {
    const products = await Product.find({subs: sub})
        .populate("category"," _id name")
        .populate("subs"," _id name")
        // .populate("postedBy"," _id name")
        .exec() 
    res.json(products)
}

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({shipping: shipping})
        .populate("category"," _id name")
        .populate("subs"," _id name")
        // .populate("postedBy"," _id name")
        .exec() 
    res.json(products)
}
const handleBrand = async (req, res, brand) => {
    const products = await Product.find({brand: brand})
        .populate("category"," _id name")
        .populate("subs"," _id name")
        // .populate("postedBy"," _id name")
        .exec() 
    res.json(products)
}
const handleColor = async (req, res, color) => {
    const products = await Product.find({color: color})
        .populate("category"," _id name")
        .populate("subs"," _id name")
        // .populate("postedBy"," _id name")
        .exec() 
    res.json(products)
}

exports.searchFilters = async (req, res) => {
    const {query, price, category, stars, sub, shipping, color, brand} = req.body

    if(query) {
        // console.log("query", query);
        await handleQuery(req, res, query)
    }

    if(price !== undefined) {
        // console.log("price -->", price);
        await handlePrice(req, res, price)
    }
    if(category) {
        // console.log("category -->", category);
        await handleCategory(req, res, category)
    }
    if(stars) {
        // console.log("stars -->", stars);
        await handleStar(req, res, stars)
    }
    if(sub) {
        // console.log("sub -->", sub);
        await handleSub(req, res, sub)
    }
    if(shipping) {
        // console.log("shipping -->", shipping);
        await handleShipping(req, res, shipping)
    }
    if(color) {
        // console.log("color -->", color);
        await handleColor(req, res, color)
    }
    if(brand) {
        // console.log("brand -->", brand);
        await handleBrand(req, res, brand)
    }
}

exports.listVendorProducts = async (req, res) => {
    const products = await Product.find({ vendorId: req.vendor._id })
        .populate('category')
        .populate('subs')
        .sort({ createdAt: -1 })
        .exec();
    return res.json(products);
}

exports.listPublicVendorProducts = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.vendorId)) return res.status(400).json({ message: 'Invalid vendor id.' });
    const vendor = await User.findOne({ _id: req.params.vendorId, role: 'vendor', 'vendorProfile.status': 'active' }).select('_id').exec();
    if (!vendor) return res.status(404).json({ message: 'Vendor not found.' });
    const products = await Product.find({ vendorId: req.params.vendorId })
        .populate('category')
        .populate('subs')
        .sort({ createdAt: -1 })
        .exec();
    return res.json(products);
}