import Sidebar from "../Components/Sidebar";

const Premium = () => {
  const handleUpgradeClick = () => {
    alert("Feature coming soon!");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 px-8 pt-8 pb-12 flex flex-col items-center justify-start">
        <h1 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-white">
          Premium Plans
        </h1>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Plan */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-white">
              Basic
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Great for individuals starting their financial journey.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 mb-4">
              <li>Track income & expenses</li>
              <li>Set up to 3 goals</li>
              <li>Basic reporting</li>
            </ul>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              Free
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-yellow-500">
            <h2 className="text-xl font-semibold mb-4 text-yellow-600 dark:text-yellow-400">
              Premium
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Unlock all features and maximize your budgeting potential.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 mb-4">
              <li>Unlimited goals</li>
              <li>Detailed analytics</li>
              <li>Priority support</li>
              <li>Bank sync</li>
              <li>AI-powered insights</li>
            </ul>
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              $4.99/mo
            </div>
            <button
              onClick={handleUpgradeClick}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Premium;
