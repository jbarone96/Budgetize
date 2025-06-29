import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

interface Entry {
  id?: string;
  type: "Income" | "Expense";
  label: string;
  amount: number;
  date: string;
}

const Spinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const IncomeExpenses = () => {
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeKey((prev) => prev + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: "Income", label: "", amount: "" });
  const [filter, setFilter] = useState<"All" | "Income" | "Expense">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"amount" | "date">("amount");

  useEffect(() => {
    const fetchData = async () => {
      const fetchDocs = async () => {
        const snapshot = await getDocs(collection(db, "entries"));
        const loadedData: Entry[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Entry, "id">),
        }));
        setData(loadedData);
      };

      const timeout = new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        await Promise.race([fetchDocs(), timeout]);
      } catch (err) {
        toast.error("Failed to load data from Firebase");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddEntry = async () => {
    if (!form.label || !form.amount || isNaN(Number(form.amount))) return;
    const newEntry: Entry = {
      type: form.type as "Income" | "Expense",
      label: form.label.charAt(0).toUpperCase() + form.label.slice(1),
      amount: parseFloat(form.amount),
      date: new Date().toISOString(),
    };
    try {
      const docRef = await addDoc(collection(db, "entries"), newEntry);
      setData([...data, { ...newEntry, id: docRef.id }]);
      toast.success(`${newEntry.type} added!`);
    } catch {
      toast.error("Failed to add entry");
    }
    setForm({ type: "Income", label: "", amount: "" });
  };

  const handleDeleteEntry = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this entry?"
    );
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "entries", id));
      const updated = data.filter((entry) => entry.id !== id);
      setData(updated);
      toast.error("Entry removed!");
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  const filteredData =
    filter === "All" ? data : data.filter((d) => d.type === filter);

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    } else {
      return sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const income = data.filter((d) => d.type === "Income");
  const expenses = data.filter((d) => d.type === "Expense");

  const chartData = (() => {
    const grouped: Record<
      string,
      { income: number; expense: number; date: Date }
    > = {};
    data.forEach((entry) => {
      const dateObj = new Date(entry.date);
      const key = dateObj.toLocaleString(undefined, {
        month: "short",
        year: "numeric",
      });
      if (!grouped[key])
        grouped[key] = { income: 0, expense: 0, date: dateObj };
      if (entry.type === "Income") grouped[key].income += entry.amount;
      else grouped[key].expense += entry.amount;
    });

    const labels = Object.entries(grouped)
      .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
      .map(([key]) => key);
    const incomeData = labels.map((l) => grouped[l].income);
    const expenseData = labels.map((l) => grouped[l].expense);

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          backgroundColor: "#34d399",
        },
        {
          label: "Expenses",
          data: expenseData,
          backgroundColor: "#f87171",
        },
      ],
    };
  })();

  const getChartTextColor = () => {
    return document.documentElement.classList.contains("dark")
      ? "#ffffff"
      : "#000000";
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: getChartTextColor(),
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `$${context.parsed.y.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
        },
      },
      title: {
        display: true,
        text: "Income vs Expenses",
        color: getChartTextColor(),
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: getChartTextColor(),
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: getChartTextColor(),
          callback: (value) => `$${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <Toaster position="top-right" />
        <h1 className="text-3xl font-bold mb-2 text-center">
          Income & Expenses
        </h1>
        <div className="mb-6 px-2 py-2 flex justify-center">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full shadow">
            You are viewing demo data
          </span>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="w-full max-w-5xl h-[400px] md:h-[500px] mb-6 bg-white dark:bg-gray-800 rounded-lg p-6 mx-auto text-center">
              <div className="relative w-full h-full">
                <Bar
                  key={themeKey}
                  data={
                    data.length === 0
                      ? {
                          labels: ["No data"],
                          datasets: [
                            {
                              label: "Income",
                              data: [0],
                              backgroundColor: "#34d399",
                            },
                            {
                              label: "Expenses",
                              data: [0],
                              backgroundColor: "#f87171",
                            },
                          ],
                        }
                      : chartData
                  }
                  options={chartOptions}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-6 px-4 text-center">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border px-3 py-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white w-full max-w-[200px] text-center"
              >
                <option value="All">All</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border px-3 py-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white w-full max-w-[200px] text-center"
              >
                <option value="amount">Sort by Amount</option>
                <option value="date">Sort by Date</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="flex items-center gap-1 border px-3 py-2 rounded w-full max-w-[160px] justify-center text-sm sm:max-w-[180px]"
              >
                {sortOrder === "asc" ? <ArrowUpCircle /> : <ArrowDownCircle />}{" "}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 mb-6 w-full max-w-4xl mx-auto px-4">
              <select
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full max-w-[200px] bg-white dark:bg-gray-700 text-black dark:text-white"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <input
                name="label"
                value={form.label}
                onChange={handleInputChange}
                placeholder="Label"
                className="capitalize border px-3 py-2 rounded w-full max-w-[300px] bg-white dark:bg-gray-700 text-black dark:text-white"
              />
              <input
                name="amount"
                value={form.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                className="border px-3 py-2 rounded w-full max-w-[300px] bg-white dark:bg-gray-700 text-black dark:text-white"
              />
              <button
                onClick={handleAddEntry}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full max-w-[150px]"
              >
                Add
              </button>
            </div>
          </>
        )}

        {!loading && data.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 w-full flex flex-col items-center overflow-x-auto">
            <div className="grid grid-cols-2 gap-6 w-full mb-6 text-center">
              <div>
                <h2 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
                  Total Income
                </h2>
                <p className="text-xl font-bold">
                  $
                  {totalIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
                  Total Expenses
                </h2>
                <p className="text-xl font-bold">
                  $
                  {totalExpenses.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="w-full overflow-x-auto px-2">
              <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-1">
                Entries
              </h3>
              <div className="min-w-[600px] grid grid-cols-5 gap-4 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
                <div>Label</div>
                <div>Date</div>
                <div>Type</div>
                <div>Amount</div>
                <div className="text-right">Action</div>
              </div>
              <ul>
                {sortedData.map((entry, index) => (
                  <li
                    key={entry.id}
                    className="min-w-[600px] grid grid-cols-5 gap-4 items-center border-b border-gray-300 dark:border-gray-700 py-2 px-2"
                  >
                    <div className="truncate font-medium">{entry.label}</div>
                    <div>
                      {new Date(entry.date)
                        .toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replaceAll("/", "-")}
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.type === "Income"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {entry.type}
                      </span>
                    </div>
                    <div className="font-semibold">
                      $
                      {entry.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => handleDeleteEntry(entry.id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default IncomeExpenses;
