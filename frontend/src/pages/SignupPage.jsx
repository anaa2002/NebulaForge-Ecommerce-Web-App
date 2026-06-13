import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSigningUp(true);
    setError("");

    try {
      await signup(userForm);
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
    } finally {
      setIsSigningUp(false);
    }
  }

  return (
    <main className="page">
      <section className="page-card auth-card">
        <p className="eyebrow">Create a Seal</p>
        <h1>Sign Up</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={userForm.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />

          <input
            type="email"
            name="email"
            value={userForm.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />

          <input
            type="password"
            name="password"
            value={userForm.password}
            onChange={handleChange}
            placeholder="Password (min 8 chars)"
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button
            className="btn btn--primary"
            type="submit"
            disabled={isSigningUp}
          >
            {isSigningUp ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignupPage;
