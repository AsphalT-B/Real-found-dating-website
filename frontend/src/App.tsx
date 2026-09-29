import { useState, type FormEvent } from "react";
import { authClient } from "./lib/auth-client";
import ProfileForm from "./ProfileForm";
type AuthMode = "signup" | "signin";
function App() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        });
        if (error) {
          setMessage(error.message || "Unable to create your account.");
          return;
        }
        setMessage("Your account was created successfully.");
        setShowProfile(true);
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          setMessage(error.message || "Invalid email or password.");
          return;
        }
        setMessage("You are signed in.");
        setShowProfile(true);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  function switchMode() {
    setMode((currentMode) => (currentMode === "signup" ? "signin" : "signup"));
    setMessage("");
  }
  const isSignup = mode === "signup";
  const submitLabel = isSubmitting
    ? isSignup
      ? "Creating account..."
      : "Signing in..."
    : isSignup
      ? "Create account"
      : "Sign in";
      if (showProfile) {
        return (
          <main className="min-h-screen bg-rose-50 px-6 py-12 text-slate-900">
            <section className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                Found
              </p>

              <h1 className="mt-3 text-3xl font-bold">Complete your profile</h1>

              <p className="mt-3 mb-8 text-slate-600">
                Tell us a little about yourself.
              </p>

              <ProfileForm />
            </section>
          </main>
        );
      }
  return (
    <main className="min-h-screen bg-rose-50 px-6 py-12 text-slate-900">
      <section className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
          Found
        </p>
        <h1 className="mt-3 text-3xl font-bold">
          {isSignup ? "Create your dating profile" : "Welcome back"}
        </h1>
        <p className="mt-3 text-slate-600">
          {isSignup
            ? "Start with an account. We will build your profile next."
            : "Sign in to continue to your profile."}
        </p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {isSignup && (
            <label className="block">
              <span className="text-sm font-medium">Name</span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-rose-500"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-rose-500"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-rose-500"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </label>
          <button
            className="w-full rounded-xl bg-rose-600 px-4 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {submitLabel}
          </button>
        </form>
        <button
          className="mt-4 w-full text-sm text-rose-600 hover:underline"
          type="button"
          onClick={switchMode}
        >
          {isSignup
            ? "Already have an account? Sign in"
            : "Need an account? Create one"}
        </button>

        {message && (
          <p className="mt-5 text-sm text-slate-700" aria-live="polite">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
export default App;
