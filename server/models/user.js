const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            required: true,
            index: true,
        },
        nickName: {
            type: String,
            unique: true,
            text: true,
            index: true,
        },
        mobileNo: {
            type: String,
            unique: true,
            sparse: true, // allows multiple null values
        },          
        role: {
            type: String,
            enum: ['subscriber', 'admin', 'vendor', 'talent'],
            default: 'subscriber'
        },
        vendorProfile: {
            status: { type: String, enum: ['inactive', 'active', 'suspended'], default: 'inactive' },
            shopName: String,
            description: String,
            phone: String,
            serviceArea: String,
            productTypes: [String],
            payoutProvider: String,
            payoutAccountName: String,
            termsAcceptedAt: Date,
            activatedAt: Date,
        },
        talentProfile: {
            status: { type: String, enum: ['inactive', 'active', 'suspended'], default: 'inactive' },
            displayName: String,
            description: String,
            phone: String,
            portfolioLink: String,
            specialties: [String],
            serviceArea: String,
            startingPrice: Number,
            availability: { type: String, default: 'Available for enquiries' },
            payoutProvider: String,
            payoutAccountName: String,
            termsAcceptedAt: Date,
            activatedAt: Date,
            escrowStatus: { type: String, enum: ['not_configured', 'provider_required'], default: 'provider_required' },
        },
        cart: {
            type: Array,
            default: [],
        },
        address: String,
        //wishlist: String
    },
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema)