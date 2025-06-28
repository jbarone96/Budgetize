import { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AnimatePresence, motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

// Define a reusable type for transactions
type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
};

const Transactions = () => {
  const [fieldErrors, setFieldErrors] = useState({
    date: false,
    description: false,
    amount: false,
    category: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: "asc" | "desc";
  } | null>({ key: "date", direction: "desc" });
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    amount: 0,
    category: "",
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "entries"));
      const txns: Transaction[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          date: formatDisplayDate(data.date || ""),
          description: capitalizeDescription(
            data.label || data.description || ""
          ),
          amount: typeof data.amount === "number" ? data.amount : 0,
          category: data.type || data.category || "",
        };
      });
      setTransactions(txns);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, "entries", id));
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  const isValidDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!month || !day || !year || year > 2100 || year < 1900) return false;
    const date = new Date(`${year}-${month}-${day}`);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  };

  const handleAddTransaction = async () => {
    const errors = {
      date: !newTransaction.date || !isValidDate(newTransaction.date),
      description: !newTransaction.description,
      amount: newTransaction.amount <= 0,
      category: !newTransaction.category,
    };

    setFieldErrors(errors);

    const hasError = Object.values(errors).some(Boolean);
    if (hasError) {
      alert("Please fill out all fields correctly before saving.");
      return;
    }
    try {
      await addDoc(collection(db, "entries"), {
        date: formatDisplayDate(newTransaction.date),
        label: newTransaction.description,
        amount: newTransaction.amount,
        type: newTransaction.category,
      });
      setNewTransaction({ date: "", description: "", amount: 0, category: "" });
      setFieldErrors({
        date: false,
        description: false,
        amount: false,
        category: false,
      });
      setFormVisible(false);
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleClearForm = () => {
    setNewTransaction({ date: "", description: "", amount: 0, category: "" });
    setFieldErrors({
      date: false,
      description: false,
      amount: false,
      category: false,
    });
  };

  const sortedTransactions = [...transactions];
  if (sortConfig !== null) {
    if (sortConfig.key === "date") {
      sortedTransactions.sort((a, b) => {
        const [aMonth, aDay, aYear] = a.date.split("-").map(Number);
        const [bMonth, bDay, bYear] = b.date.split("-").map(Number);
        const aDate = new Date(aYear, aMonth - 1, aDay);
        const bDate = new Date(bYear, bMonth - 1, bDay);
        return sortConfig.direction === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      });
    }
  }

  const toggleSortDirection = () => {
    setSortConfig((prev) =>
      prev?.direction === "asc"
        ? { key: "date", direction: "desc" }
        : { key: "date", direction: "asc" }
    );
  };

  const formatDisplayDate = (value: string) => {
    const parts = value.split(/[\/\-]/);
    if (parts.length === 3) {
      let [a, b, c] = parts;
      if (a.length === 4) {
        return `${b.padStart(2, "0")}-${c.padStart(2, "0")}-${a}`;
      } else {
        return `${a.padStart(2, "0")}-${b.padStart(2, "0")}-${c}`;
      }
    }
    return value;
  };

  const capitalizeDescription = (text: string) => {
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const renderTransactions = () => {
    if (error) {
      return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
        </div>
      );
    }

    if (loading && transactions.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading transactions...
          </p>
        </div>
      );
    }

    if (!loading && transactions.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            No transactions found.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-end mb-4">
          <button
            className="text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-white px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-white dark:hover:text-gray-900 flex items-center gap-2"
            onClick={toggleSortDirection}
          >
            {sortConfig?.direction === "asc" ? (
              <FaSortAmountUp className="text-inherit" />
            ) : (
              <FaSortAmountDown className="text-inherit" />
            )}
            {sortConfig?.direction === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                  Amount
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sortedTransactions.map((txn) => (
                <tr key={txn.id} className="group">
                  <td className="px-4 py-2">{txn.date}</td>
                  <td className="px-4 py-2">{txn.description}</td>
                  <td className="px-4 py-2">{txn.category}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      txn.category === "Expense"
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-800 dark:text-green-400"
                    }`}
                  >
                    {txn.category === "Expense" ? "-" : "+"}$
                    {Math.abs(txn.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => deleteTransaction(txn.id)}
                      className="invisible group-hover:visible text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-1">Transaction History</h1>

        <div className="mb-6 px-2 py-2">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full shadow">
            You are viewing demo data
          </span>
        </div>

        <div className="mb-4">
          <button
            className={`px-4 py-2 rounded text-white ${
              formVisible
                ? "bg-red-900 hover:bg-red-900"
                : "bg-green-700 hover:bg-green-600"
            }`}
            onClick={() => setFormVisible(!formVisible)}
          >
            {formVisible ? "Cancel" : "Add a Transaction"}
          </button>
        </div>

        {renderTransactions()}
      </main>
    </div>
  );
};

export default Transactions;
