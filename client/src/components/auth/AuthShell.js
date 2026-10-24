import React from "react";
import { Link } from "react-router-dom";

const AuthShell = ({ kicker, title, description, children, footer, step }) => (
  <section className="auth-shell" aria-label={title}>
    <aside className="auth-visual">
      <Link className="auth-brand" to="/" aria-label="Innterior home">
        <img src="/Innterior_logo.png" alt="Innterior" />
      </Link>
      <div className="auth-visual-copy">
        <p>ROOM TO FEEL AT HOME</p>
        <h2>Make space for the life you live.</h2>
        <span>Considered pieces. Personal spaces. A home that feels like yours.</span>
      </div>
      <span className="auth-image-caption">A softer place to land</span>
    </aside>
    <div className="auth-panel">
      <div className="auth-panel-inner">
        <Link className="auth-brand-mobile" to="/" aria-label="Innterior home">
          <img src="/Innterior_logo.png" alt="Innterior" />
        </Link>
        {step && (
          <div className="auth-steps" aria-label={`Step ${step} of 2`}>
            <span className={step === 1 ? "is-current" : "is-complete"}>01 <i>Account</i></span>
            <span className={step === 2 ? "is-current" : ""}>02 <i>Finish setup</i></span>
          </div>
        )}
        <header className="auth-heading">
          <p className="auth-kicker">{kicker}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
        <p className="auth-privacy-note">Your details stay private and are only used to manage your account.</p>
      </div>
    </div>
  </section>
);

export default AuthShell;
