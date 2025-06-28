import { useState } from "react";
import { usePlaidLink } from "react-plaid-link";

function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    bankAccount: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating account:", form);
  };

  const onSuccess = (public_token: string, metadata: any) => {
    console.log("Plaid Success:", public_token, metadata);
  };

  const config = {
    token: "",
    onSuccess,
    env: import.meta.env.VITE_PLAID_ENV,
    clientName: "Budgetize",
    key: import.meta.env.VITE_PLAID_SANDBOX_SECRET,
    product: ["auth", "transactions"],
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          Sign Up - Step {step} of 3
        </h2>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age
              </label>
              <select
                name="age"
                value={form.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              >
                <option value="">Select Age</option>
                {Array.from({ length: 83 }, (_, i) => 18 + i).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link Your Bank{" "}
                <span className="text-xs text-gray-400">(optional)</span>
              </label>
              <button
                type="button"
                onClick={() => open()}
                disabled={!ready}
                className="w-full py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded"
              >
                Connect Bank Account
              </button>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                You can skip this step and add bank info later.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-colors"
            >
              Create Account
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Signup;
