const admin = require('../firebase')
const user  = require('../models/user')


exports.authCheck = async (req, res, next) =>{
    //console.log(req.headers);
    try {
        const firebaseUser = await admin
            .auth() 
            .verifyIdToken(req.headers.authtoken)
        console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
        req.user = firebaseUser
        next()
    } catch (err) {
        res.status(401).json({
            err: "Invalid or expired token"
        })
    }
}

exports.adminCheck = async (req, res, next) =>{
    //console.log(req.headers);
    const {email} = req.user

    const adminUser = await user.findOne({email}).exec()
    if(!adminUser || adminUser.role !== 'admin'){
        res.status(403).json({
            err: "Admin resource, access denied"
        }) 
    }
    else{
        next()
    }
}

exports.vendorCheck = async (req, res, next) => {
    try {
        const { email } = req.user;
        const vendor = await user.findOne({ email }).select('_id role vendorProfile.status').exec();
        if (!vendor || vendor.role !== 'vendor' || vendor.vendorProfile?.status !== 'active') {
            return res.status(403).json({ err: 'An approved, active vendor profile is required.' });
        }
        req.vendor = vendor;
        return next();
    } catch (error) {
        return res.status(500).json({ err: 'Vendor access could not be verified.' });
    }
};