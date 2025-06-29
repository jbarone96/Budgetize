import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../Utils/AuthProvider";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = [2024, 2025];

const generateColors = (count: number) => {
  const baseColors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];
  while (baseColors.length < count) {
    baseColors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }
  return baseColors.slice(0, count);
};

const formatCurrency = (value: number) => {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Spending = () => {
  const [responsiveRadius, setResponsiveRadius] = useState(130);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setResponsiveRadius(90);
      else if (width < 768) setResponsiveRadius(110);
      else setResponsiveRadius(130);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [spendingData, setSpendingData] = useState<
    { category: string; amount: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentMonth = new Date().getMonth();
    return months.includes("June") ? 5 : currentMonth;
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    const currentYear = new Date().getFullYear();
    return years.includes(2025) ? 2025 : currentYear;
  });
  const { user } = useAuth();
  const activeUID = user && user.uid ? user.uid : "demoUserId";

  useEffect(() => {
    const fetchSpendingData = async () => {
      try {
        const [transactionsSnapshot, entriesSnapshot] = await Promise.all([
          getDocs(collection(db, "transactions")),
          getDocs(collection(db, "entries")),
        ]);

        const allDocs = [...transactionsSnapshot.docs, ...entriesSnapshot.docs];
        const categoryMap: { [key: string]: number } = {};

        allDocs.forEach((docSnap) => {
          const { category, type, amount, date, userId } = docSnap.data();
          if (userId && userId !== activeUID) return;
          if (typeof amount !== "number" || !date) return;

          let entryDate;
          try {
            const parts = date.trim().split(/[-\/]/);
            if (parts.length !== 3) throw new Error("Invalid date format");

            let month, day, year;
            if (parts[0].length === 4) {
              year = Number(parts[0]);
              month = Number(parts[1]);
              day = Number(parts[2]);
            } else {
              month = Number(parts[0]);
              day = Number(parts[1]);
              year = Number(parts[2]);
            }

            entryDate = new Date(year, month - 1, day);
            if (isNaN(entryDate.getTime())) throw new Error("Invalid date");
          } catch {
            return;
          }

          const isExpense =
            (type && type.toLowerCase() === "expense") ||
            (category && category.toLowerCase() !== "income");

          if (
            entryDate.getMonth() === selectedMonth &&
            entryDate.getFullYear() === selectedYear &&
            isExpense &&
            category &&
            category.trim() !== ""
          ) {
            const trimmedCategory = category.trim();
            categoryMap[trimmedCategory] =
              (categoryMap[trimmedCategory] || 0) + amount;
          }
        });

        const transformed = Object.entries(categoryMap).map(
          ([category, amount]) => ({ category, amount })
        );

        setSpendingData(transformed);
      } catch (err) {
        console.error("🔥 Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpendingData();
  }, [selectedMonth, selectedYear, user]);

  const hasData = spendingData.length > 0;
  const totalSpending = spendingData.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const highestSpending = hasData
    ? spendingData.reduce((prev, curr) =>
        curr.amount > prev.amount ? curr : prev
      )
    : null;

  const pieColors = generateColors(spendingData.length);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Spending Overview
        </h1>
        <div className="mb-6 flex justify-center">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full shadow">
            You are viewing demo data
          </span>
        </div>

        {!loading && (
          <div className="flex justify-center gap-4 mb-6">
            <select
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 px-3 py-2 rounded"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month, idx) => (
                <option key={month} value={idx}>
                  {month}
                </option>
              ))}
            </select>

            <select
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 px-3 py-2 rounded"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg px-4 py-4 w-full max-w-7xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Spending by Category
            </h2>
            {hasData ? (
              <div
                className="w-full max-w-3xl hidden sm:block"
                style={{ height: 300 }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={spendingData}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={110}
                      outerRadius={responsiveRadius}
                      paddingAngle={12}
                      isAnimationActive={true}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {spendingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        color: "#f9fafb",
                      }}
                      itemStyle={{ color: "#f9fafb" }}
                      labelStyle={{ color: "#f9fafb" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No spending data available.
              </p>
            )}
            <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-200">
              Total Spending: {formatCurrency(totalSpending)}
            </p>
            {highestSpending && (
              <p className="mt-1 text-sm font-medium text-red-500 dark:text-red-400">
                Highest Spending: {highestSpending.category}
              </p>
            )}
            <div className="mt-4 w-full">
              <h2 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">
                Breakdown by Category
              </h2>
              {hasData ? (
                <ul className="space-y-2">
                  {spendingData.map((item, index) => (
                    <li
                      key={index}
                      className={`flex justify-between text-sm text-gray-700 dark:text-gray-300 pb-1 ${
                        index !== spendingData.length - 1
                          ? "border-b border-gray-200 dark:border-gray-700"
                          : ""
                      }`}
                    >
                      <span>{item.category}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No spending data available.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Spending;
