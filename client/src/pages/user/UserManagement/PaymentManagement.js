import React, { useState } from "react";
import { PaystackButton } from "react-paystack";
import HelpNav from "../../../components/nav/HelpNav";
import StripePayment from "./paymentsMethods/StripePayment";

const PaymentManagement = () => {
  const publicKey = "pk_test_xxxxxxxxxxxxxx"; // Replace with your Paystack public key
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(100); // nominal amount to trigger charge (in kobo)
  const [alternativeCurrency, setalternativeCurrency] = useState(false);

  const onSuccess = (reference) => {
    // reference.trxref gives transaction reference
    console.log("Success:", reference);
    // Optionally send reference to your backend to store authorization
    // You’ll need to use Paystack's `/transaction/verify/:ref` endpoint to retrieve the authorization token
  };

  const onClose = () => {
    console.log("Transaction was closed");
  };

  const componentProps = {
    email,
    amount: amount * 100, // Paystack uses kobo
    metadata: {
      name,
    },
    publicKey,
    text: "Save Payment Method",
    onSuccess,
    onClose,
    embed: false,
    tag: "button",
  };

  return (
    <div className="row container mt-2">
      <div className="col-md-3">
        <HelpNav />
      </div>
      <div className="col-md-9 montserrat-complementary-ss">
        {alternativeCurrency?<img src="/Stripe_logo_1.png" alt="stripe_logo__innterior_decoration" className="payment__logo"/>:<img src="/Paystack_idSL4BuSLF_1.png" alt="paystack_logo__innterior_decoration" className="payment__logo"/>}
        {alternativeCurrency ? (
          <StripePayment setalternativeCurrency={setalternativeCurrency} />
        ) : (
          <>
            <form className="form-group">
              <h2 className="mb-4">Update Payment Method</h2>
              <label>Cardholder Name</label>
              <input
                type="text"
                className="form-control mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />

              <label>Email Address</label>
              <input
                type="email"
                className="form-control mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />

              <label>Nominal Charge</label>
              <input
                type="number"
                className="form-control mb-3"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
              />

              {/* Paystack handles the card input internally */}
              <div className="d-grid">
                <PaystackButton
                  {...componentProps}
                  className="btn btn-primary mt-3"
                />
              </div>
            </form>
          </>
        )}
        <div className="d-grid">
          <button
            onClick={() => setalternativeCurrency(!alternativeCurrency)}
            className="btn btn-success mt-3"
          >
            {alternativeCurrency
              ? "Paystack Option"
              : "Alternative Currency Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
