const mongoose = require('mongoose');
const RoleApplication = require('../models/applications');
const User = require('../models/user');

const supportedRoles = new Set(['vendor', 'talent']);
const trimText = (value, maxLength = 500) => String(value || '').trim().slice(0, maxLength);
const safeApplication = (application) => {
    const data = application.toObject ? application.toObject() : application;
    delete data.identityReference;
    delete data.businessRegistrationReference;
    delete data.payoutAccountName;
    delete data.payoutProvider;
    return data;
};

exports.createRoleApplication = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        if (!user) return res.status(404).json({ message: 'Account not found.' });
        if (!supportedRoles.has(req.body.role)) {
            return res.status(400).json({ message: 'Choose vendor or talent.' });
        }

        const existing = await RoleApplication.findOne({
            user: user._id,
            role: req.body.role,
            status: { $in: ['pending', 'approved'] },
        }).exec();
        if (existing) {
            return res.status(409).json({
                message: existing.status === 'approved'
                    ? 'Your profile is already approved.'
                    : 'You already have an application under review.',
                application: safeApplication(existing),
            });
        }

        const identityReference = trimText(req.body.identityReference, 120);
        const businessRegistrationReference = trimText(req.body.businessRegistrationReference, 120);
        const portfolioLink = trimText(req.body.portfolioLink, 300);
        const payoutProvider = trimText(req.body.payoutProvider, 80);
        const payoutAccountName = trimText(req.body.payoutAccountName, 120);
        const phone = trimText(req.body.phone, 40);
        const fullName = trimText(req.body.fullName, 120);
        const email = trimText(req.body.email, 180).toLowerCase();

        if (!fullName || !email || !phone || !identityReference || !payoutProvider || !payoutAccountName) {
            return res.status(400).json({ message: 'Complete all required identity, contact, and payout verification details.' });
        }
        if (req.body.termsAccepted !== true) {
            return res.status(400).json({ message: 'Accept the marketplace terms before submitting.' });
        }
        if (req.body.role === 'vendor' && !businessRegistrationReference) {
            return res.status(400).json({ message: 'Business registration reference is required for vendors.' });
        }
        if (req.body.role === 'talent' && !portfolioLink) {
            return res.status(400).json({ message: 'A portfolio link is required for talent applications.' });
        }
        if (email !== user.email.toLowerCase()) {
            return res.status(400).json({ message: 'Use the email address on your account.' });
        }

        const application = await RoleApplication.create({
            fullName,
            email,
            user: user._id,
            phone,
            role: req.body.role,
            businessName: trimText(req.body.businessName, 140),
            portfolioLink,
            description: trimText(req.body.description, 3000),
            specialties: Array.isArray(req.body.specialties) ? req.body.specialties.map((value) => trimText(value, 60)).filter(Boolean).slice(0, 20) : [],
            productTypes: Array.isArray(req.body.productTypes) ? req.body.productTypes.map((value) => trimText(value, 60)).filter(Boolean).slice(0, 20) : [],
            serviceArea: trimText(req.body.serviceArea, 160),
            identityReference,
            businessRegistrationReference,
            payoutAccountName,
            payoutProvider,
            verification: {
                identity: false,
                business: false,
                portfolio: false,
                payout: false,
                terms: req.body.termsAccepted === true,
            },
        });

        return res.status(201).json({ application: safeApplication(application) });
    } catch (error) {
        console.error('Role application submission failed:', error.message);
        return res.status(400).json({ message: 'Application submission failed. Check your details and try again.' });
    }
};

exports.myApplications = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).select('_id').exec();
    if (!user) return res.status(404).json({ message: 'Account not found.' });
    const applications = await RoleApplication.find({ user: user._id }).sort({ createdAt: -1 }).exec();
    return res.json(applications.map(safeApplication));
};

exports.listApplications = async (_req, res) => {
    const applications = await RoleApplication.find({})
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .exec();
    return res.json(applications);
};

exports.reviewApplication = async (req, res) => {
    const { status, verification = {}, reviewNotes = '' } = req.body;
    if (!['pending', 'approved', 'declined', 'suspended'].includes(status)) {
        return res.status(400).json({ message: 'Choose a valid application status.' });
    }

    try {
        const reviewer = await User.findOne({ email: req.user.email }).select('_id').exec();
        const application = await RoleApplication.findById(req.params.id).exec();
        if (!application) return res.status(404).json({ message: 'Application not found.' });

        const fields = application.role === 'vendor'
            ? ['identity', 'business', 'payout', 'terms']
            : ['identity', 'portfolio', 'payout', 'terms'];
        const existingVerification = application.verification?.toObject?.() || {};
        const nextVerification = { ...existingVerification, ...verification };
        nextVerification.terms = existingVerification.terms === true;
        if (status === 'approved' && fields.some((field) => nextVerification[field] !== true)) {
            return res.status(422).json({ message: 'Complete every verification check for this role before approval.' });
        }

        application.verification = nextVerification;
        application.reviewNotes = trimText(reviewNotes, 2000);
        application.reviewedBy = reviewer?._id;
        application.reviewedAt = new Date();
        application.status = status;
        await application.save();

        const user = await User.findById(application.user).exec();
        if (!user) return res.status(404).json({ message: 'Applicant account not found.' });

        if (status === 'approved') {
            const activatedAt = new Date();
            if (application.role === 'vendor') {
                user.role = 'vendor';
                user.vendorProfile = {
                    status: 'active',
                    shopName: application.businessName || application.fullName,
                    description: application.description,
                    phone: application.phone,
                    serviceArea: application.serviceArea,
                    productTypes: application.productTypes,
                    payoutProvider: application.payoutProvider,
                    payoutAccountName: application.payoutAccountName,
                    termsAcceptedAt: application.verification.terms ? application.updatedAt : null,
                    activatedAt,
                };
            } else {
                user.role = 'talent';
                user.talentProfile = {
                    status: 'active',
                    displayName: application.businessName || application.fullName,
                    description: application.description,
                    phone: application.phone,
                    portfolioLink: application.portfolioLink,
                    specialties: application.specialties,
                    serviceArea: application.serviceArea,
                    payoutProvider: application.payoutProvider,
                    payoutAccountName: application.payoutAccountName,
                    termsAcceptedAt: application.verification.terms ? application.updatedAt : null,
                    activatedAt,
                    escrowStatus: 'provider_required',
                };
            }
            await user.save();
        } else if (status === 'suspended') {
            if (application.role === 'vendor') {
                user.vendorProfile.status = 'suspended';
            } else {
                user.talentProfile.status = 'suspended';
            }
            user.role = 'subscriber';
            await user.save();
        }

        return res.json({ application: safeApplication(application), role: user.role });
    } catch (error) {
        console.error('Role application review failed:', error.message);
        return res.status(400).json({ message: 'Application review failed.' });
    }
};

exports.myMarketplaceProfile = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).select('role vendorProfile talentProfile').lean().exec();
    if (!user) return res.status(404).json({ message: 'Account not found.' });
    if (!['vendor', 'talent', 'admin'].includes(user.role)) {
        return res.status(403).json({ message: 'An approved vendor or talent profile is required.' });
    }
    const profile = user.role === 'vendor' ? user.vendorProfile : user.talentProfile;
    if (user.role !== 'admin' && profile?.status !== 'active') {
        return res.status(403).json({ message: 'Your marketplace profile is not active.' });
    }
    return res.json({ role: user.role, profile });
};

exports.listPublicTalents = async (_req, res) => {
    const users = await User.find({ role: 'talent', 'talentProfile.status': 'active' })
        .select('talentProfile')
        .sort({ 'talentProfile.displayName': 1 })
        .lean()
        .exec();
    return res.json(users.map((user) => ({
        _id: user._id,
        displayName: user.talentProfile.displayName,
        description: user.talentProfile.description,
        portfolioLink: user.talentProfile.portfolioLink,
        specialties: user.talentProfile.specialties,
        serviceArea: user.talentProfile.serviceArea,
        startingPrice: user.talentProfile.startingPrice,
        availability: user.talentProfile.availability,
    })));
};

exports.listPublicVendors = async (_req, res) => {
    const users = await User.find({ role: 'vendor', 'vendorProfile.status': 'active' })
        .select('vendorProfile')
        .sort({ 'vendorProfile.shopName': 1 })
        .lean()
        .exec();
    return res.json(users.map((user) => ({
        _id: user._id,
        shopName: user.vendorProfile.shopName,
        description: user.vendorProfile.description,
        serviceArea: user.vendorProfile.serviceArea,
        productTypes: user.vendorProfile.productTypes,
    })));
};

exports.updateMarketplaceProfile = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();
    if (!user || !['vendor', 'talent'].includes(user.role)) {
        return res.status(403).json({ message: 'An approved marketplace profile is required.' });
    }
    const field = user.role === 'vendor' ? 'vendorProfile' : 'talentProfile';
    const current = user[field];
    const allowed = user.role === 'vendor'
        ? ['shopName', 'description', 'phone', 'serviceArea', 'productTypes']
        : ['displayName', 'description', 'phone', 'portfolioLink', 'specialties', 'serviceArea', 'startingPrice', 'availability'];

    for (const key of allowed) {
        if (req.body[key] === undefined) continue;
        if (['productTypes', 'specialties'].includes(key)) {
            current[key] = Array.isArray(req.body[key]) ? req.body[key].map((value) => trimText(value, 60)).filter(Boolean).slice(0, 20) : current[key];
        } else if (key === 'startingPrice') {
            const value = Number(req.body[key]);
            if (Number.isFinite(value) && value >= 0) current[key] = value;
        } else {
            current[key] = trimText(req.body[key], key === 'description' ? 3000 : 300);
        }
    }
    await user.save();
    return res.json({ role: user.role, profile: user[field] });
};

exports.ensureApplicationId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid application id.' });
    next();
};
