import { Link } from "react-router-dom";

export const Brand = () => (
  <LinkBrand />
);

function LinkBrand() {
  return (
    <Link className="auth-brand" to="/" aria-label="Paytm home">
      <span className="auth-brand-mark" aria-hidden="true">p</span>
      <span>pay<span>tm</span></span>
    </Link>
  );
}

export const AuthField = ({ id, label, type = "text", ...inputProps }) => (
  <div className="auth-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} name={id} type={type} className="auth-input" {...inputProps} />
  </div>
);

export const AuthLayout = ({ mode, title, description, children }) => (
  <main className="auth-page">
    <section className="auth-shell">
      <aside className={`auth-showcase auth-showcase-${mode}`}>
        <Brand />
        <div className="showcase-copy">
          <span className="showcase-eyebrow">PAYMENTS, MADE SIMPLE</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="wallet-card" aria-label="Wallet card preview">
          <div className="wallet-card-top"><span>paytm</span><span className="wallet-chip" aria-hidden="true" /></div>
          <div className="wallet-number">•••• &nbsp; •••• &nbsp; •••• &nbsp; 2048</div>
          <div className="wallet-card-bottom"><span>YOUR WALLET</span><span>UPI · PAYMENTS</span></div>
        </div>
        <div className="showcase-dots" aria-hidden="true"><i /><i /><i /></div>
        <p className="showcase-footnote">One account for the things that move you.</p>
      </aside>
      <section className="auth-content" aria-label={mode === "create" ? "Create account" : "Sign in"}>
        {children}
      </section>
    </section>
    <footer className="auth-footer"><span>© 2026 Paytm Wallet</span><span>Simple. Secure. Yours.</span></footer>
  </main>
);
