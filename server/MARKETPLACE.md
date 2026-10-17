# Marketplace roles

Applications for `vendor` and `talent` are separate records. Admin approval requires the role-specific verification checks and is the only operation that activates the corresponding profile.

For databases created with the earlier role-application schema, run `npm run migrate:role-applications` once from the server package after `DATABASE` is configured. This removes legacy unique indexes on application email and phone so one account can apply for both marketplace roles and reapply after a declined application.

Vendor product management is restricted to the vendor's own products. Product checkout, talent booking, payouts, and escrow remain unavailable until a compliant payment provider, signed webhook verification, order state machine, refund/dispute handling, and custody/release policy have been implemented and configured. Do not describe funds as held in escrow until those controls are live.
