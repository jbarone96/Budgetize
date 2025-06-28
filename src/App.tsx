import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";
import Goals from "./Pages/Goals";
import Spending from "./Pages/Spending";
import IncomeExpenses from "./Pages/IncomeExpenses";
import Settings from "./Pages/Settings";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Premium from "./Pages/Premium";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/spending" element={<Spending />} />
            <Route path="/income-expenses" element={<IncomeExpenses />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/premium" element={<Premium />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </div>
    </Router>
  );
}

export default App;
