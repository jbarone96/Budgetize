import {
  FaChartPie,
  FaExchangeAlt,
  FaBullseye,
  FaWallet,
  FaMoneyCheckAlt,
  FaCog,
} from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

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
    <aside className="w-64 bg-white dark:bg-gray-800 shadow h-screen sticky top-0 flex flex-col">
      <div>
        <nav className="px-4 pt-6 space-y-4">
          {links.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
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
      </div>
    </aside>
  );
}

export default Sidebar;
