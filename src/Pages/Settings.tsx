import { useState } from "react";
import Sidebar from "../Components/Sidebar";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 px-8 pt-8 pb-12 flex flex-col items-center justify-start">
        <h1 className="text-3xl font-bold mb-8 text-neutral-800 dark:text-white">
          Settings
        </h1>

        <div className="w-full max-w-2xl space-y-8">
          {/* Preferences Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-neutral-800 dark:text-white border-neutral-200 dark:border-neutral-700">
              Preferences
            </h2>
            <div className="space-y-4">
              {/* Weekly Summary Report */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
                  Weekly Summary Email
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={weeklySummary}
                    onChange={() => setWeeklySummary(!weeklySummary)}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-600 rounded-full peer peer-focus:outline-none peer-checked:bg-green-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white dark:bg-neutral-200 w-4 h-4 rounded-full shadow-md transform transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>

              {/* Enable Notifications */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
                  Enable Notifications
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-600 rounded-full peer peer-focus:outline-none peer-checked:bg-green-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white dark:bg-neutral-200 w-4 h-4 rounded-full shadow-md transform transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-neutral-800 dark:text-white border-neutral-200 dark:border-neutral-700">
              Account
            </h2>
            <div className="space-y-4">
              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
                  Auto-Sync Bank Accounts
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={autoSync}
                    onChange={() => setAutoSync(!autoSync)}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-600 rounded-full peer peer-focus:outline-none peer-checked:bg-green-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white dark:bg-neutral-200 w-4 h-4 rounded-full shadow-md transform transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-neutral-800 dark:text-white border-neutral-200 dark:border-neutral-700">
              Security
            </h2>
            <div className="space-y-4">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
                  Enable Two-Factor Authentication
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={twoFactor}
                    onChange={() => setTwoFactor(!twoFactor)}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-600 rounded-full peer peer-focus:outline-none peer-checked:bg-green-600 transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white dark:bg-neutral-200 w-4 h-4 rounded-full shadow-md transform transition-transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Data Tools */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-neutral-800 dark:text-white border-neutral-200 dark:border-neutral-700">
              Data Tools
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-blue-800 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow w-full sm:w-auto"
                onClick={() => alert("Export feature coming soon")}
              >
                Export Data
              </button>
              <button
                className="bg-purple-800 hover:bg-purple-600 text-white font-semibold px-4 py-2 rounded shadow w-full sm:w-auto"
                onClick={() => alert("Import feature coming soon")}
              >
                Import Data
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 shadow border border-red-300 dark:border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400 border-b border-red-300 dark:border-red-500 pb-2">
              Danger Zone
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-neutral-300">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded shadow">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
