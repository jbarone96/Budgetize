import { FaSun, FaMoon, FaCrown } from "react-icons/fa";
import { useTheme } from "../Utils/ThemeProvider";
import { useEffect, useState } from "react";

function Header() {
  const { darkMode, toggleTheme } = useTheme();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const handleToggle = () => {
    setTheme((prev) => !prev);
    toggleTheme();
  };

  return (
    <header className="w-full bg-teal-700 shadow-md dark:bg-gray-800">
      <div className="w-full flex items-center justify-between px-6 py-4">
        <a
          href="/dashboard"
          className="text-2xl font-bold text-white transition-colors duration-300 hover:text-green-600"
        >
          Budgetize
        </a>

        <nav className="flex items-center gap-4 text-sm md:text-base">
          <a
            href="/premium"
            className="py-1.5 px-4 rounded bg-yellow-500 text-yellow-100 font-semibold flex items-center gap-2 transition-colors hover:bg-yellow-600 shadow-md"
          >
            <FaCrown className="text-yellow-100" />
            <span className="hidden md:inline">Get Premium</span>
          </a>

          <a
            href="/signin"
            className="text-white hover:text-green-300 font-medium transition-colors duration-300"
          >
            Sign In
          </a>

          {/* Toggle Switch */}
          <label className="relative inline-block w-14 h-7 cursor-pointer">
            <input
              type="checkbox"
              checked={theme}
              onChange={handleToggle}
              className="sr-only peer"
            />
            <div className="absolute inset-0 flex items-center justify-between px-2 bg-gray-200 dark:bg-slate-600 rounded-full transition-colors">
              <FaSun className="text-yellow-400 text-xs" />
              <FaMoon className="text-gray-300 text-xs" />
            </div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-7 z-10"></div>
          </label>
        </nav>
      </div>
    </header>
  );
}

export default Header;
