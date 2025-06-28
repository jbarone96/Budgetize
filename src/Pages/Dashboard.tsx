import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../Components/Sidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { useAuth } from "../Utils/AuthProvider";

const generateColors = (count: number) => {
  const baseColors = [
    "#10B981",
    "#3B82F6",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
    "#F472B6",
    "#FCD34D",
    "#34D399",
    "#60A5FA",
    "#A78BFA",
  ];
  while (baseColors.length < count) {
    baseColors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }
  return baseColors.slice(0, count);
};

const getMonthName = (date: string) =>
  new Date(date).toLocaleString("default", { month: "short" });

const getYearMonth = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}`;
};

const getNetChange = (current: number, previous: number) => {
  const delta = current - previous;
  const prefix = delta >= 0 ? "+" : "-";
  return `${prefix}$${Math.abs(delta).toFixed(2)}`;
};

const getAllYears = (entries: Entry[]) => {
  const years = Array.from(
    new Set(entries.map((e) => new Date(e.date).getFullYear()))
  );
  return years.sort((a, b) => a - b);
};

const getAllMonths = () => {
  return Array.from({ length: 12 }, (_, i) => i + 1);
};

type Entry = {
  id: string;
  type: "Income" | "Expense";
  label: string;
  amount: number;
  date: string;
  userId?: string;
};

function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user === undefined) return;

    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "entries"));
        const allData = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Omit<Entry, "id">;
          return { id: docSnap.id, ...data };
        });

        const fallbackUID = "demoUserId";
        const activeUID = user?.uid ?? fallbackUID;
        const filteredData = allData.filter((e) => e.userId === activeUID);

        setEntries(filteredData);

        if (filteredData.length > 0) {
          const latest = filteredData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];
          const latestDate = new Date(latest.date);
          setSelectedYear(latestDate.getFullYear());
          setSelectedMonth(latestDate.getMonth() + 1);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const filteredEntries = entries.filter((e) => {
    const date = new Date(e.date);
    return (
      (!selectedYear || date.getFullYear() === selectedYear) &&
      (!selectedMonth || date.getMonth() + 1 === selectedMonth)
    );
  });

  const allYears = getAllYears(entries);
  const allMonths = getAllMonths();

  const incomeEntries = filteredEntries.filter((e) => e.type === "Income");
  const expenseEntries = filteredEntries.filter((e) => e.type === "Expense");
  const totalIncome = incomeEntries.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenseEntries.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalBalance = totalIncome - totalExpenses;

  const categoryTotals: { [key: string]: number } = {};
  expenseEntries.forEach((e) => {
    if (!categoryTotals[e.label]) {
      categoryTotals[e.label] = 0;
    }
    categoryTotals[e.label] += e.amount;
  });
  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const pieColors = generateColors(pieData.length);

  const lineDataMap = new Map();
  filteredEntries.forEach((entry) => {
    const date = new Date(entry.date);
    const day = date.getDate();
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${day}`;
    if (!lineDataMap.has(key)) {
      lineDataMap.set(key, {
        day: `${date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}`,
        income: 0,
        expenses: 0,
      });
    }
    const dataPoint = lineDataMap.get(key);
    if (entry.type === "Income") {
      dataPoint.income += entry.amount;
    } else {
      dataPoint.expenses += entry.amount;
    }
  });
  const lineData = Array.from(lineDataMap.entries())
    .sort(
      ([keyA], [keyB]) => new Date(keyA).getTime() - new Date(keyB).getTime()
    )
    .map(([, value]) => value);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 px-6 py-8">
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>

        {!user && (
          <div className="mb-6 px-2 py-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full shadow">
              You are viewing demo data
            </span>
          </div>
        )}

        <div className="mb-6 flex gap-4 justify-end">
          <select
            value={selectedMonth ?? ""}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-4 py-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="">All Months</option>
            {allMonths.map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear ?? ""}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 rounded border bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="">All Years</option>
            {allYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
            <p className="text-2xl font-bold text-green-700 dark:text-green-500">
              $
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Deposits</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              $
              {totalIncome.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Withdrawals</h3>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400">
              $
              {totalExpenses.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Spending Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={110}
                    fill="#8884d8"
                    paddingAngle={8}
                    labelLine={false}
                    dataKey="value"
                    label={({ name, value }: { name: string; value: number }) =>
                      `${name}: $${value.toFixed(2)}`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      color: "#f9fafb",
                      border: "none",
                    }}
                    itemStyle={{ color: "#f9fafb" }}
                    labelStyle={{ color: "#f9fafb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400">
                No spending data available.
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
            {lineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#8884d8" tickMargin={10} />
                  <YAxis
                    stroke="#8884d8"
                    tickFormatter={(value: number) =>
                      `$${value.toLocaleString()}`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      border: "none",
                    }}
                    labelStyle={{
                      color: "var(--tw-text-opacity,1)",
                      opacity: 1,
                    }}
                    wrapperStyle={{
                      filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    fill="#10B981"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#EF4444"
                    fill="#EF4444"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400">
                No income/expense data available.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredEntries.length > 0 ? (
                  filteredEntries.slice(0, 5).map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 text-sm">
                        {new Date(entry.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">{entry.label}</td>
                      <td className="px-6 py-4 text-sm">{entry.type}</td>
                      <td
                        className={`px-6 py-4 text-sm text-right ${
                          entry.type === "Income"
                            ? "text-green-800 dark:text-green-700"
                            : "text-red-500 dark:text-red-400"
                        }`}
                      >
                        {entry.type === "Income" ? "+" : "-"}$
                        {entry.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-sm text-center text-gray-400"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
