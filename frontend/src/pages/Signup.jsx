import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, AuthField, Brand } from "../components/AuthLayout";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("0");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/signup", {
        username: username.trim(), firstName: firstName.trim(), lastName: lastName.trim(), password, balance,
      });
      if (!response.data.token) throw new Error("The server did not return a sign-up token.");
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.status === 409
        ? "That account already exists. Try signing in instead."
        : "We couldn’t create your account. Check your details and make sure the server is running.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout mode="create" title="A simpler way to pay" description="Create your wallet and keep everyday payments moving.">
      <div className="auth-mobile-brand"><Brand /></div>
      <div className="auth-heading">
        <span className="auth-kicker">GET STARTED IN A MINUTE</span>
        <h1>Create your account</h1>
        <p>Tell us a little about yourself to get started.</p>
      </div>
      <form className="auth-form signup-form" onSubmit={handleSubmit}>
        <div className="auth-field-row">
          <AuthField id="signup-first-name" label="First name" type="text" placeholder="Akhil"
            autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
          <AuthField id="signup-last-name" label="Last name" type="text" placeholder="Jay"
            autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
        </div>
        <AuthField id="signup-username" label="Username" type="text" placeholder="you@example.com"
          autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        <AuthField id="signup-password" label="Password" type="password" placeholder="Choose a password"
          autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <AuthField id="signup-balance" label="Opening balance" type="number" min="0" step="1" placeholder="0"
          value={balance} onChange={(event) => setBalance(event.target.value)} required />
        <p className="auth-hint">You can change your wallet balance later.</p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}<span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/signin">Sign in</Link></p>
      <p className="auth-secure"><span aria-hidden="true">✦</span> Your account details stay private and secure.</p>
    </AuthLayout>
  );
};
