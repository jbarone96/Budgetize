import { useState } from "react";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle sign in logic
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-emerald-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Keep me signed in
              </span>
            </label>
            <a href="#" className="text-emerald-500 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          — OR —
        </div>

        <button className="mt-4 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-emerald-500 font-medium hover:underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Signin;
