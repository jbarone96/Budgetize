import {
  FaChartPie,
  FaExchangeAlt,
  FaBullseye,
  FaWallet,
  FaMoneyCheckAlt,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/dashboard", icon: <FaChartPie />, label: "Dashboard" },
    { to: "/transactions", icon: <FaExchangeAlt />, label: "Transactions" },
    { to: "/goals", icon: <FaBullseye />, label: "Goals" },
    { to: "/spending", icon: <FaWallet />, label: "Spending" },
    {
      to: "/income-expenses",
      icon: <FaMoneyCheckAlt />,
      label: "Income / Expenses",
    },
    { to: "/settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <>
      {/* Floating Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-30 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-gray-100 text-2xl"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 min-h-screen z-20 transform bg-white dark:bg-gray-800 shadow w-64 transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="px-4 pt-6 space-y-4 pb-6">
          {links.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                location.pathname === to
                  ? "bg-gray-100 dark:bg-gray-600 text-emerald-800 dark:text-emerald-500 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:text-emerald-800 dark:hover:text-emerald-500"
              }`}
            >
              {icon} {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
