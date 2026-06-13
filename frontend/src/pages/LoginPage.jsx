import { useState } from "react";
import { useAuth } from "../context/authContext";

function LoginPage() {
  const { login, isCheckingAuth } = useAuth();

  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");
    try {
      await login(userForm);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="page">
      <section className="page-card auth-card">
        <p className="eyebrow">Welcome Back</p>
        <h1>Login</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="email"
            value={userForm.email}
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={userForm.password}
            name="password"
            onChange={handleChange}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button
            className="btn btn--primary"
            type="submit"
            disabled={isCheckingAuth}
          >
            {isCheckingAuth ? "Logging In..." : "Log In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
