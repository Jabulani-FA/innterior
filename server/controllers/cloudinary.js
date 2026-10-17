const cloudinary = require('cloudinary')
const Product = require('../models/product')

cloudinary.config({ 
    cloud_name: 'dvdy3c2af', 
    api_key: '445675953187966', 
    api_secret: 'zG2MvPeXBOvDKdLncvt9mcKw6Wk',
});

exports.upload = async (req,res) => {
    console.log("image:",req.body.image);
    cloudinary.v2.uploader.upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        }, (err,result) => {
        if(err) return({success: false, err})
        res.json({
            public_id: result.public_id,
            url: result.secure_url,
        })
        console.log(result);
    });
};
exports.remove = async (req, res) => {
    const imageId = String(req.body.public_id || '');
    if (!imageId) return res.status(400).json({ message: 'Image reference is required.' });
    if (req.vendor) {
        const ownedProduct = await Product.findOne({
            vendorId: req.vendor._id,
            images: { $elemMatch: { public_id: imageId } },
        }).select('_id').exec();
        if (!ownedProduct) return res.status(403).json({ message: 'You can only remove images used by your own products.' });
    }

    try {
        const result = await cloudinary.v2.uploader.destroy(imageId, { resource_type: 'image' });
        if (result.result !== 'ok' && result.result !== 'not found') {
            return res.status(502).json({ message: 'Image could not be removed.' });
        }
        return res.json({ success: true });
    } catch (error) {
        return res.status(502).json({ message: 'Image could not be removed.' });
    }
}