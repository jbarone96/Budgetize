import React, { useEffect, useState } from "react";
import Cards from "../Components/Cards/Cards";
import Modal from "antd/es/modal/Modal";
import AddExpense from "../Components/Modal/AddExpense";
import AddIncome from "../Components/Modal/AddIncome";
import TransactionTable from "../Components/Transactions/Transactions";
import ChartComponent from "../Components/Chart/Chart";
import { toast } from "react-toastify";
import { auth, db } from "firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [expenseModalVisibility, setExpenseModalVisibility] = useState(false);
  const [incomeModalVisibility, setIncomeModalVisibility] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const showExpenseModal = () => {
    setExpenseModalVisibility(true);
  };

  const showIncomeModal = () => {
    setIncomeModalVisibility(true);
  };

  const handleExpenseCancel = () => {
    setExpenseModalVisibility(false);
  };

  const handleIncomeCancel = () => {
    setIncomeModalVisibility(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("MM-DD-YYYY"),
      amount: parseFloat(values.amount),
      name: values.name,
    };
    setTransactions([...transactions, newTransaction]);
    setExpenseModalVisibility(false);
    setIncomeModalVisibility(false);
    addTransaction(newTransaction);
  };

  const addTransaction = async (transaction, many) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.iud}/transactions`),
        transaction
      );
      if (!many) toast.success("Transaction Added!");

      setTransactions([...transactions, transaction]);
      calculateBalance();
      fetchTransactions();
    } catch (error) {
      if (!many) toast.error("Couldn't Add Transaction");
    }
  };

  const fetchTransactions = async () => {
    if (user) {
      const dataRef = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(dataRef);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push({ ...doc.data(), id: doc.id });
      });
      setTransactions(transactionArray);
      toast.success("Transaction Fetched!");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += parseFloat(transaction.amount);
      } else {
        totalExpense += parseFloat(transaction.amount);
      }
    });
    setIncome(totalIncome);
    setExpense(totalExpense);
    setCurrentBalance(totalIncome - totalExpense);
  };

  return (
    <div>
      <Cards
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        income={income}
        expense={expense}
        currentBalance={currentBalance}
      />
      <Modal open={incomeModalVisibility} onCancel={handleIncomeCancel}>
        Income
      </Modal>
      <Modal open={expenseModalVisibility} onCancel={handleExpenseCancel}>
        Expense
      </Modal>
      <AddIncome
        incomeModalVisibility={incomeModalVisibility}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <AddExpense
        expenseModalVisibility={expenseModalVisibility}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <div className="chart container">
        {transactions.length !== 0 ? (
          <div className="line-chart">
            <ChartComponent transactions={transactions} />
          </div>
        ) : (
          <div className="no-transaction">
            <h2>No Transactions Available</h2>
            <img
              src={process.env.PUBLIC_URL + "/coin.gif"}
              alt="No-transaction-img"
            />
          </div>
        )}
      </div>
      <TransactionTable
        transactions={transactions}
        addTransaction={addTransaction}
        fetchTransactions={fetchTransactions}
      />
    </div>
  );
};

export default Dashboard;
