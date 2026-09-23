import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, AuthField, Brand } from "../components/AuthLayout";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await axios.post("http://localhost:8000/api/v1/user/signin", {
        username: username.trim(),
        password,
      });
      if (!response.data.token) throw new Error("The server did not return a sign-in token.");
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.status === 401 || err.response?.status === 404
        ? "That username and password don’t match. Try again."
        : "We couldn’t sign you in. Check that the server is running and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout mode="welcome" title="Welcome back" description="Sign in to pick up where you left off.">
      <div className="auth-mobile-brand"><Brand /></div>
      <div className="auth-heading">
        <span className="auth-kicker">YOUR WALLET, AT A GLANCE</span>
        <h1>Sign in</h1>
        <p>Enter your details to access your account.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField id="signin-username" label="Username" type="text" placeholder="you@example.com"
          autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        <AuthField id="signin-password" label="Password" type="password" placeholder="Enter your password"
          autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}<span aria-hidden="true">→</span>
        </button>
      </form>
      <p className="auth-switch">New here? <Link to="/signup">Create an account</Link></p>
      <p className="auth-secure"><span aria-hidden="true">✦</span> Your account details stay private and secure.</p>
    </AuthLayout>
  );
};
