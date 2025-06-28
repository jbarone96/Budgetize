import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import Sidebar from "../Components/Sidebar";
import { FaBullseye, FaTrash } from "react-icons/fa";
import Confetti from "react-confetti";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

// Define a type for financial goals
type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  dueDate?: string;
};

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const triggeredRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "goals"));
        const goalsData: Goal[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Goal[];
        setGoals(goalsData);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  useEffect(() => {
    const completed = goals.find(
      (goal) =>
        goal.currentAmount >= goal.targetAmount &&
        !triggeredRef.current.has(goal.id)
    );

    if (completed) {
      triggeredRef.current.add(completed.id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [goals]);

  const getTimeLeft = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : "Deadline passed";
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    if (progress < 100) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-1">Your Financial Goals</h1>
        <div className="mb-6 px-2 py-2">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-full shadow">
            You are viewing demo data
          </span>
        </div>

        {/* Add Goal Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const title = (
                form.elements.namedItem("title") as HTMLInputElement
              )?.value.trim();
              const targetAmount = parseFloat(
                (form.elements.namedItem("targetAmount") as HTMLInputElement)
                  ?.value
              );
              const currentAmount = parseFloat(
                (form.elements.namedItem("currentAmount") as HTMLInputElement)
                  ?.value
              );
              const deadline = (
                form.elements.namedItem("deadline") as HTMLInputElement
              )?.value;

              if (
                !title ||
                isNaN(targetAmount) ||
                isNaN(currentAmount) ||
                !deadline
              ) {
                alert("Please fill out all fields with valid values.");
                return;
              }

              if (targetAmount <= 0) {
                alert("Target Amount must be greater than 0.");
                return;
              }

              if (currentAmount < 0) {
                alert("Current Amount cannot be negative.");
                return;
              }

              const newGoalData = {
                title,
                targetAmount,
                currentAmount,
                dueDate: deadline,
                deadline,
                category: "",
                userId: "demoUserId",
                isComplete: false,
                createdAt: new Date().toISOString(),
              };

              let newGoal: Goal;
              try {
                const addedDoc = await addDoc(
                  collection(db, "goals"),
                  newGoalData
                );
                newGoal = { id: addedDoc.id, ...newGoalData };
              } catch (err) {
                console.error("Failed to add goal to Firestore:", err);
                alert("There was an error adding your goal. Please try again.");
                return;
              }

              const querySnapshot = await getDocs(collection(db, "goals"));
              const goalsData: Goal[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Goal[];
              setGoals(goalsData);
              form.reset();
              toast.success("Goal added successfully!");
            }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Goal Title
              </label>
              <input
                type="text"
                name="title"
                onChange={(e) => {
                  e.target.value = e.target.value
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ");
                }}
                className="w-full p-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="text"
                  name="targetAmount"
                  className="pl-6 w-full p-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="text"
                  name="currentAmount"
                  className="pl-6 w-full p-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                placeholder="MM-DD-YYYY"
                style={{ textTransform: "uppercase" }}
                className="w-full p-2 rounded border dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              />
            </div>
            <div className="md:col-span-4 mt-4 flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
              >
                Add Goal
              </button>
              <button
                type="button"
                onClick={() => document.querySelector("form")?.reset()}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Sort Toggle */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium">Sort by Due Date:</label>
          <button
            className="bg-slate-600 hover:bg-emerald-700 text-white text-sm font-semibold py-1 px-3 rounded"
            onClick={() => {
              const sorted = [
                ...goals.filter(
                  (g) => !completedGoals.find((c) => c.id === g.id)
                ),
              ].sort((a, b) => {
                const aDate = new Date(a.dueDate || a.deadline || "").getTime();
                const bDate = new Date(b.dueDate || b.deadline || "").getTime();
                return aDate - bDate;
              });
              setGoals(sorted);
            }}
          >
            Ascending
          </button>
          <button
            className="bg-slate-600 hover:bg-emerald-700 text-white text-sm font-semibold py-1 px-3 rounded"
            onClick={() => {
              const sorted = [
                ...goals.filter(
                  (g) => !completedGoals.find((c) => c.id === g.id)
                ),
              ].sort((a, b) => {
                const aDate = new Date(a.dueDate || a.deadline || "").getTime();
                const bDate = new Date(b.dueDate || b.deadline || "").getTime();
                return bDate - aDate;
              });
              setGoals(sorted);
            }}
          >
            Descending
          </button>
        </div>

        {loading ? (
          <div>Loading goals...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progress = Math.min(
                (goal.currentAmount / goal.targetAmount) * 100,
                100
              );
              const timeLeft = getTimeLeft(
                `${goal.dueDate || goal.deadline}T00:00:00`
              );
              const barColor = getProgressColor(progress);
              const isComplete = progress >= 100;

              return (
                <div
                  key={goal.id}
                  className={`group bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 transition-transform duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                    isComplete ? "animate-pulse" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 relative group">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {goal.title}
                    </h2>
                    <button
                      onClick={async () => {
                        if (
                          confirm("Are you sure you want to delete this goal?")
                        ) {
                          try {
                            await deleteDoc(doc(db, "goals", String(goal.id)));
                            setGoals((prev) =>
                              prev.filter((g) => g.id !== goal.id)
                            );
                            toast.success("Goal deleted successfully!");
                          } catch (err) {
                            console.error(
                              "Failed to delete goal from Firestore:",
                              err
                            );
                            alert(
                              "There was an error deleting the goal. Please try again."
                            );
                          }
                        }
                      }}
                      className="absolute top-0 right-0 p-1 rounded-full text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Delete Goal"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded transition-transform duration-200 group-hover:translate-x-[-2rem]">
                      Due:{" "}
                      {goal.dueDate
                        ? new Date(
                            `${goal.dueDate}T00:00:00`
                          ).toLocaleDateString("en-US")
                        : "No deadline"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {timeLeft}
                  </div>
                  <div className="mb-2">
                    <p>Target: ${goal.targetAmount.toLocaleString()}</p>
                    <p>Saved: ${goal.currentAmount.toLocaleString()}</p>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                      Remaining: $
                      {(
                        goal.targetAmount - goal.currentAmount
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className={`${barColor} h-4 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {isComplete &&
                    !completedGoals.find((g) => g.id === goal.id) && (
                      <button
                        onClick={() => {
                          setCompletedGoals((prev) => [...prev, { ...goal }]);
                          setGoals((prev) =>
                            prev.filter((g) => g.id !== goal.id)
                          );
                        }}
                        className="mt-6 mx-auto block text-sm bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
                      >
                        Mark as Complete
                      </button>
                    )}
                </div>
              );
            })}
          </div>
        )}

        {/* Confetti celebration */}
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

        {completedGoals.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">
              Completed Goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-blue-50 dark:bg-gray-800/70 p-6 rounded-xl shadow"
                >
                  <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {goal.title}
                  </h3>
                  <p>Target: ${goal.targetAmount.toLocaleString()}</p>
                  <p>Saved: ${goal.currentAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed on: {new Date().toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Goals;
