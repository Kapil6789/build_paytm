import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const api = "http://localhost:8000/api/v1";
const formatRupees = (amount) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(amount ?? 0);

export const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState("");
  const [usersError, setUsersError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin", { replace: true });
      return;
    }
    axios.get(`${api}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setAccount(data.user))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin", { replace: true });
        } else setError("We couldn’t load your wallet. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [navigate, token]);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setUsersLoading(true);
      setUsersError("");
      axios.get(`${api}/user/search`, {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }).then(({ data }) => setRecipients(data.users ?? []))
        .catch((err) => {
          if (err.name !== "CanceledError") setUsersError("We couldn’t load recipients. Try again in a moment.");
        })
        .finally(() => { if (!controller.signal.aborted) setUsersLoading(false); });
    }, 180);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, token]);

  const initials = `${account?.firstName?.[0] ?? "U"}${account?.lastName?.[0] ?? ""}`.toUpperCase();
  const fullName = [account?.firstName, account?.lastName].filter(Boolean).join(" ") || "Your account";

  function openTransfer(recipient) {
    const name = `${recipient.firstName} ${recipient.lastName}`.trim();
    navigate(`/sendmoney?id=${recipient.id}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(recipient.username)}`);
  }

  return (
    <div className="wallet-app">
      <header className="app-nav">
        <Link to="/dashboard" className="app-brand"><span className="app-brand-mark">p</span> pay<span>tm</span></Link>
        <div className="app-nav-right">
          <span className="app-welcome">Hi, {account?.firstName ?? "there"}</span>
          <span className="app-avatar" aria-label={fullName}>{initials}</span>
          <button className="app-logout" onClick={() => { localStorage.removeItem("token"); navigate("/signin", { replace: true }); }}>Sign out</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-intro">
          <div><span className="app-kicker">YOUR WALLET</span><h1>Good to see you, {account?.firstName ?? ""}</h1><p>Here’s what’s happening with your account today.</p></div>
          <span className="dashboard-date">PAYMENTS · PEOPLE · PEACE OF MIND</span>
        </div>

        {error && <div className="app-alert" role="alert">{error}</div>}

        <section className="balance-panel">
          <div className="balance-panel-copy">
            <span className="balance-label">AVAILABLE BALANCE</span>
            {loading ? <div className="balance-skeleton" aria-label="Loading balance" /> : <strong>{formatRupees(account?.balance)}</strong>}
            <span className="balance-note"><i /> Wallet balance</span>
          </div>
          <div className="balance-panel-action">
            <span className="balance-orbit balance-orbit-one" /><span className="balance-orbit balance-orbit-two" />
            <span className="balance-card-chip" aria-hidden="true" />
            <span className="balance-card-caption">PAYTM WALLET</span>
            <span className="balance-card-stars">•••• &nbsp; •••• &nbsp; ••••</span>
          </div>
        </section>

        <section className="people-section">
          <div className="section-heading"><div><span className="app-kicker">QUICK TRANSFERS</span><h2>People</h2><p>Find someone and send money in a few taps.</p></div><span className="people-count">{recipients.length} {recipients.length === 1 ? "person" : "people"}</span></div>
          <label className="people-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or username" aria-label="Search people" /><kbd>⌘ K</kbd></label>

          {usersError && <div className="app-alert" role="alert">{usersError}</div>}
          {usersLoading ? <div className="people-loading">Finding people…</div> : recipients.length === 0 ? (
            <div className="people-empty"><span className="empty-icon">◎</span><strong>{query ? "No matches yet" : "No other accounts yet"}</strong><p>{query ? "Try another name or username." : "When more people join, you’ll find them here."}</p></div>
          ) : (
            <div className="people-grid">{recipients.map((person, index) => (
              <article className="person-card" key={person.id}>
                <div className={`person-avatar avatar-tone-${index % 5}`}>{person.firstName?.[0]?.toUpperCase() ?? "?"}</div>
                <div className="person-info"><strong>{person.firstName} {person.lastName}</strong><span>{person.username}</span></div>
                <button className="person-send" onClick={() => openTransfer(person)} aria-label={`Send money to ${person.firstName} ${person.lastName}`}>Send <span aria-hidden="true">↗</span></button>
              </article>
            ))}</div>
          )}
        </section>
        <footer className="dashboard-footer"><span>Paytm Wallet</span><span>Transfers are protected by your account session.</span></footer>
      </main>
    </div>
  );
};
