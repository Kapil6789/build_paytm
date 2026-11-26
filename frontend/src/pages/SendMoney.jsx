import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const api = API_URL;
const formatRupees = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(amount ?? 0);

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recipientId = Number(searchParams.get("id"));
  const recipientName = searchParams.get("name") || "Paytm user";
  const recipientUsername = searchParams.get("username") || "";
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sentAmount, setSentAmount] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }
    axios.get(`${api}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setBalance(data.user.balance))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin", { replace: true });
        } else setError("We couldn’t load your wallet balance.");
      })
      .finally(() => setLoadingBalance(false));
  }, [navigate, token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const value = Number(amount);
    if (!Number.isInteger(recipientId) || recipientId < 1) return setError("Choose a valid recipient from your people list.");
    if (!Number.isInteger(value) || value < 1) return setError("Enter a whole amount greater than zero.");
    if (balance !== null && value > balance) return setError("That’s more than your available balance.");

    setSubmitting(true);
    try {
      const { data } = await axios.post(`${api}/account/transferFunds`, {
        toAccountId: recipientId,
        amount: value,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setBalance(data.balance);
      setSentAmount(value);
      setSuccess(true);
      setAmount("");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true });
      } else setError(err.response?.data?.message || "Your transfer couldn’t be completed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="wallet-app transfer-page">
      <header className="app-nav">
        <Link to="/dashboard" className="app-brand"><span className="app-brand-mark">p</span> pay<span>tm</span></Link>
        <Link to="/dashboard" className="transfer-back">← <span>Back to wallet</span></Link>
      </header>
      <main className="transfer-main">
        <div className="transfer-breadcrumb"><Link to="/dashboard">Wallet</Link><span>/</span><span>Send money</span></div>
        <section className="transfer-card">
          <div className="transfer-card-top"><span className="transfer-icon" aria-hidden="true">↗</span><span className="transfer-step">QUICK TRANSFER</span></div>
          <div className="transfer-heading"><h1>Send money</h1><p>Fast, simple payments to people you know.</p></div>

          {success ? (
            <div className="transfer-success" role="status">
              <span className="success-check" aria-hidden="true">✓</span>
              <span className="app-kicker">TRANSFER COMPLETE</span>
              <h2>Money sent successfully</h2>
              <p>You sent {formatRupees(sentAmount)} to {recipientName}. Your wallet balance is now {formatRupees(balance)}.</p>
              <Link className="transfer-submit transfer-done" to="/dashboard">Back to wallet <span aria-hidden="true">→</span></Link>
            </div>
          ) : (
            <>
              <div className="transfer-recipient"><span className="recipient-avatar">{recipientName[0]?.toUpperCase() ?? "P"}</span><span className="recipient-details"><strong>{recipientName}</strong><span>{recipientUsername}</span></span><span className="verified-pill">PAYTM</span></div>
              <form onSubmit={handleSubmit}>
                <label className="transfer-amount-label" htmlFor="transfer-amount">Amount to send</label>
                <div className="transfer-amount-wrap"><span>₹</span><input id="transfer-amount" type="number" min="1" step="1" inputMode="numeric" placeholder="0" value={amount} onChange={(event) => setAmount(event.target.value)} required /><span className="amount-currency">INR</span></div>
                <div className="available-balance"><span>Available balance</span><strong>{loadingBalance ? "Loading…" : formatRupees(balance)}</strong></div>
                {error && <p className="transfer-error" role="alert">{error}</p>}
                <button className="transfer-submit" type="submit" disabled={submitting || loadingBalance || balance === null}>
                  {submitting ? "Sending securely…" : "Send money"}<span aria-hidden="true">→</span>
                </button>
                <p className="transfer-note"><span aria-hidden="true">⌑</span> Secure transfer from your Paytm wallet</p>
              </form>
            </>
          )}
        </section>
        <p className="transfer-support">Need help? Make sure the recipient details are correct before sending.</p>
      </main>
    </div>
  );
};
