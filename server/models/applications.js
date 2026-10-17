const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const application = new mongoose.Schema(
  {
    fullName: {
      type: String,
      text: true,
    },
    email: {
      type: String,
      text: true,
      index: true,
      required: true,
    },
    user: { type: ObjectId, ref: "User", required: true },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["vendor", "talent"],
      required: true,
    },
    businessName: {
      type: String,
      text: true,
      index: true,
    },
    portfolioLink: {
      type: String,
    },
    description: {
      type: String,
    },
    specialties: [{ type: String, trim: true }],
    productTypes: [{ type: String, trim: true }],
    serviceArea: { type: String, trim: true },
    identityReference: { type: String, trim: true },
    businessRegistrationReference: { type: String, trim: true },
    payoutAccountName: { type: String, trim: true },
    payoutProvider: { type: String, trim: true },
    verification: {
      identity: { type: Boolean, default: false },
      business: { type: Boolean, default: false },
      portfolio: { type: Boolean, default: false },
      payout: { type: Boolean, default: false },
      terms: { type: Boolean, default: false },
    },
    reviewNotes: { type: String, maxlength: 2000, default: "" },
    reviewedBy: { type: ObjectId, ref: "User" },
    reviewedAt: Date,
    status:{
      type: String,
      enum: ["pending", "approved", "declined", "suspended"],
      default: "pending"
    }
  },
  { timestamps: true }
);

application.pre('validate', function normalizeLegacyRole(next) {
  if (this.role === 'furniture-seller') this.role = 'vendor';
  if (this.role === 'interior-decorator') this.role = 'talent';
  next();
});

module.exports = mongoose.model("RoleApplication", application);
